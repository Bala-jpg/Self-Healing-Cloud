import os
from typing import Optional
import sys
import json
import asyncio
# import httpx - Moved inside function
from datetime import datetime
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from collections import Counter

# --- FIX: Ensure Python can find modules in the parent directory ---
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# --- 1. LIVE INTEGRATION ---
try:
    from services.log_collector import authenticate, fetch_logs
    print("📡 Live Log Collector module loaded successfully.")
except ImportError as e:
    print(f"❌ CRITICAL ERROR: log_collector.py not found ({e}). Live fetching is impossible.")
    raise

# --- 2. CONFIGURATION ---
# Load .env from backend root (parent of core/)
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(parent_dir, ".env"))
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") # Sourced from .env
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# --- 3. FIREBASE INITIALIZATION ---
def init_firebase():
    """Initializes Firebase and returns a Firestore client.
    Forces REST transport via environment variable to avoid gRPC connection hangs.
    """
    try:
        # Force REST transport globally for this process
        os.environ["GOOGLE_CLOUD_FIRESTORE_FORCE_REST"] = "true"
        
        if not firebase_admin._apps:
            # Look for serviceAccountKey.json in the backend/ root (parent of core/)
            key_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "serviceAccountKey.json")
            if os.path.exists(key_path):
                cred = credentials.Certificate(key_path)
                firebase_admin.initialize_app(cred)
                print(f"✅ Firebase initialized successfully (Forced REST from {key_path}).")
            else:
                print(f"⚠️ serviceAccountKey.json missing at {key_path}.")
                return None
        
        # Standard client now honors the environment variable
        return firestore.AsyncClient()
    except Exception as e:
        print(f"❌ Firebase Init Error: {e}")
        return None

db = init_firebase()

# --- 4. THE AI BRAIN (ASYNC) ---
# --- 4. THE AI BRAIN (LEGACY REMOVED) ---
# analyze_logs_async and process_trace_async have been removed to enforce 
# the Single-Call Evidence Pack architecture.
# All analysis now flows through analyze_evidence_pack_async.

# --- 6. LIVE WRAPPER (ASYNC) ---
# Global Cache & Rate Limit
ANALYSIS_CACHE = {
    "hash": None,
    "response": None,
    "timestamp": 0
}
HOURLY_CALL_COUNT = 0
HOURLY_RESET_TIME = 0

async def analyze_evidence_pack_async(evidence):
    """
    Sends the Evidence Pack to Gemini via OpenRouter (OpenAI-Compatible API).
    """
    print("🛡️ AI Brain: Analyzing Evidence Pack (OpenRouter/Gemini)...")
    
    if not OPENROUTER_API_KEY:
        print("❌ Error: OPENROUTER_API_KEY not found in .env")
        return []

    prompt = (
        "You are an expert Google Cloud SRE. Strictly follow the Output Format.\n\n"
        "TASK:\n"
        "1. Analyze the provided Error Object Groups.\n"
        "2. For EACH group, identify the root cause, explain the chain, suggest remediation, and assign confidence.\n"
        "3. Return ONLY a JSON list of objects. Use DOUBLE QUOTES for all keys and strings.\n"
        "4. Required keys: \"group_id\", \"root_cause\", \"explanation\", \"remediation\", \"confidence\" (0-100), \"priority\" (P1-P4), \"category\".\n\n"
        f"EVIDENCE PACK:\n{json.dumps(evidence)}\n"
    )
    
    # OpenRouter / OpenAI Standard Payload
    payload = {
        "model": "google/gemini-2.0-flash-001",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
        "max_tokens": 8192
    }
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:5173", # Optional: For OpenRouter ranking
        "X-Title": "Cloud RCA Assistant"         # Optional: For OpenRouter ranking
    }
    
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, json=payload, headers=headers, timeout=60.0)
            if response.status_code == 200:
                res_json = response.json()
                try:
                    # Parse OpenAI-format response
                    choices = res_json.get('choices', [])
                    if not choices: return []
                    content = choices[0].get('message', {}).get('content', '')
                    
                    content = content.replace('```json', '').replace('```', '').strip()
                    return json.loads(content)
                except json.JSONDecodeError as e:
                     print(f"❌ Gemini Parsing Error: {e}")
                     return []
                except (KeyError, IndexError) as e:
                    print(f"❌ Gemini Response Structure Error: {e}")
                    return []
            else:
                 print(f"❌ Gemini API Error: {response.status_code} - {response.text}")
                 return []
    except Exception as e:
        print(f"❌ Gemini Network Error: {e}")
        return []

async def run_analysis_for_api(time_range_minutes=60, max_traces: Optional[int] = 100, user_id="default_user"):
    global ANALYSIS_CACHE, HOURLY_CALL_COUNT, HOURLY_RESET_TIME
    import time
    import hashlib
    
    current_time = time.time()
    
    # Rate Limit: Max 6 calls per hour
    if current_time - HOURLY_RESET_TIME > 3600:
        HOURLY_CALL_COUNT = 0
        HOURLY_RESET_TIME = current_time
    
    if HOURLY_CALL_COUNT >= 6:
        print("⏳ Hourly Rate Limit Reached (6 calls/hr). Returning cached/empty.")
        if ANALYSIS_CACHE["response"]:
             return {"results": ANALYSIS_CACHE["response"], "note": "Hourly limit reached. Showing cached data."}
        return {"results": [], "error": "Hourly analysis limit reached."}

    try:
        from services.credential_manager import get_credentials
        if db is None: return {"results": [], "error": "Firebase not initialized"}
        
        # 1. Get Credentials
        creds = await get_credentials(db, user_id)
        if not creds: return {"results": [], "error": "No credentials found"}
        
        # 2. Fetch Logs
        project_id = await db.collection('user_credentials').document(user_id).get()
        pid = project_id.to_dict().get('project_id') if project_id.exists else None
        
        raw_traces = fetch_logs(creds, time_range_minutes=60, project_id=pid) # Hardcoded 60 mins
        if not raw_traces: 
            return {"results": []}

        # 3. Deterministic Grouping & Filtering (Non-LLM)
        error_groups = {} # Key: (category, root_cause_hint)
        valid_severity = ['WARNING', 'ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY']
        
        for trace_id, logs in raw_traces.items():
            # Filter for WARN/ERROR with Normalization
            filtered_logs = []
            for l in logs:
                sev = l.get('severity') or l.get('level')
                if sev in valid_severity:
                    filtered_logs.append(l)
            
            if not filtered_logs: continue
            
            # Simple heuristic for grouping
            first_err = filtered_logs[0]
            service = first_err.get('service', 'unknown')
            msg_sig = first_err.get('textPayload', '')[:50]
            
            group_key = f"{service}::{msg_sig}"
            
            if group_key not in error_groups:
                if len(error_groups) >= 10: continue # Max 10 groups cap
                
                error_groups[group_key] = {
                    "group_id": group_key, 
                    "category": "UNKNOWN", 
                    "services": set(),
                    "occurrences": 0,
                    "sample_logs": [],
                    "trace_ids": []
                }
            
            group = error_groups[group_key]
            group["occurrences"] += len(filtered_logs)
            group["services"].update(l.get('service', 'unknown') for l in logs)
            group["trace_ids"].append(trace_id)
            if len(group["sample_logs"]) < 2:
                # Safe truncate
                txt = first_err.get('textPayload', '')[:200]
                group["sample_logs"].append(txt)
        
        if not error_groups:
             return {"results": [], "note": "No WARN/ERROR logs found."}

        # 4. Create Evidence Pack
        evidence_list = []
        for k, v in error_groups.items():
            evidence_list.append({
                "group_id": k,
                "occurrences": v["occurrences"],
                "services": list(v["services"]),
                "sample_logs": v["sample_logs"]
            })
            
        evidence_pack = {
            "time_window": "last 60 minutes",
            "total_groups": len(evidence_list),
            "groups": evidence_list
        }
        
        # 5. Check Cache (Hash of Evidence Pack)
        pack_str = json.dumps(evidence_pack, sort_keys=True)
        pack_hash = hashlib.md5(pack_str.encode()).hexdigest()
        
        if ANALYSIS_CACHE["hash"] == pack_hash and (current_time - ANALYSIS_CACHE["timestamp"] < 300):
            print("📦 Using Cached Analysis Results (Evidence unchanged)")
            return {"results": ANALYSIS_CACHE["response"]}

        # 6. Single Gemini Call
        HOURLY_CALL_COUNT += 1
        llm_results = await analyze_evidence_pack_async(evidence_pack)
        
        # 7. Post-Processing & Persistence
        final_results = []
        
        for item in llm_results:
            gid = item.get("group_id")
            if gid in error_groups:
                group_data = error_groups[gid]
                representative_trace = group_data["trace_ids"][0] 
                
                # Construct result object matching frontend expectations
                res_obj = {
                    "trace_id": representative_trace,
                    "category": item.get("category"),
                    "priority": item.get("priority"),
                    "log_count": group_data["occurrences"],
                    "root_cause": item.get("root_cause"),
                    "redacted_text": item.get("explanation"), 
                    "action": item.get("remediation"),
                    "correlation": "Grouped Analysis",
                    "security_alert": False,
                    "confidence": item.get("confidence")
                }
                final_results.append(res_obj)
                
                if db:
                    incident_doc = {
                        "trace_id": representative_trace,
                        "service_name": list(group_data["services"])[0],
                        "timestamp": datetime.now().isoformat(),
                        "category": res_obj["category"],
                        "priority": res_obj["priority"],
                        "analysis": {"confidence": res_obj["confidence"], "cause": res_obj["root_cause"]},
                        "status": "OPEN",
                        "occurrence_count": group_data["occurrences"]
                    }
                    await db.collection("incidents").add(incident_doc)

        ANALYSIS_CACHE = {
            "hash": pack_hash,
            "response": final_results,
            "timestamp": current_time
        }
        
        return {"results": final_results}

    except Exception as e:
        print(f"❌ run_analysis_for_api Error: {e}")
        return {"results": [], "error": str(e)}

# --- 7. CHATBOT LOGIC (ASYNC) ---
async def chat_with_ai_async(message, user_id="default_user"):
    """
    Chat with Gemini using broad incident context.
    """
    print(f"💬 Chat request from {user_id}: {message[:50]}...")
    
    context_data = []
    if db:
        try:
            # Fetch last 50 incidents for broad context
            docs = await db.collection("incidents").order_by("timestamp", direction="DESCENDING").limit(50).get()
            for doc in docs:
                d = doc.to_dict()
                context_data.append({
                    "id": d.get("trace_id", doc.id)[:8],
                    "service": d.get("service_name"),
                    "cause": d.get("analysis", {}).get("cause"),
                    "confidence": d.get("analysis", {}).get("confidence"),
                    "priority": d.get("priority"),
                    "time": d.get("timestamp")
                })
        except Exception as e:
            print(f"⚠️ Failed to fetch chat context: {e}")

    if not OPENROUTER_API_KEY:
        print("❌ Chat Error: OPENROUTER_API_KEY not found in .env")
        return {"reply": "Configuration Error: API Key missing."}

    prompt = (
        "You are 'Reliability Chatbot', a high-performance SRE assistant. "
        "Your goal is to help users understand system health and incidents. "
        "Return a concise, expert reply. Do NOT mention you can take autonomous actions. "
        "If the user asks for suggestions, provide concrete remediation steps. "
        f"\n\nIncident Context (Latest 50):\n{json.dumps(context_data)}"
        f"\n\nUser Message: {message}"
    )
    
    # OpenRouter / OpenAI Standard Payload
    payload = {
        "model": "google/gemini-2.0-flash-001",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2, # Low temp for factual SRE advice
        "max_tokens": 1024
    }
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Cloud RCA Assistant"
    }
    
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, json=payload, headers=headers, timeout=20.0)
            if response.status_code == 200:
                res_json = response.json()
                choices = res_json.get('choices', [])
                if choices:
                    content = choices[0].get('message', {}).get('content', '')
                    if content:
                        return {"reply": content}
            else:
                 print(f"❌ Chat OpenRouter API Error: Status {response.status_code} - {response.text}")
        return {"reply": "I'm having trouble connecting to my brain. Please try again."}
    except Exception as e:
        print(f"❌ Chat Network Error: {e}")
        return {"reply": "An error occurred while processing your request."}

if __name__ == "__main__":
    run_analysis_for_api(time_range_minutes=120, max_traces=5)
