import os
import sys
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from collections import Counter

# --- FIX: Ensure Python can find modules in the current directory ---
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# --- 1. LIVE INTEGRATION ---
try:
    from log_collector import authenticate, fetch_logs
    print("📡 Live Log Collector module loaded successfully.")
except ImportError as e:
    print(f"❌ CRITICAL ERROR: log_collector.py not found ({e}). Live fetching is impossible.")
    raise

# --- 2. CONFIGURATION ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY}"

# --- 3. FIREBASE INITIALIZATION ---
def init_firebase():
    try:
        if not firebase_admin._apps:
            key_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
            if os.path.exists(key_path):
                cred = credentials.Certificate(key_path)
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialized successfully.")
            else:
                print("⚠️ serviceAccountKey.json missing.")
                return None
        return firestore.client()
    except Exception as e:
        print(f"❌ Firebase Init Error: {e}")
        return None

db = init_firebase()

# --- 4. THE AI BRAIN ---
def analyze_logs(log_data):
    print("🛡️ AI Brain: Performing Deep Analysis on Cloud Traces...")
    prompt = (
        "You are an expert Google Cloud SRE and Security Agent. Analyze these logs: "
        f"{json.dumps(log_data)} "
        "\nReturn ONLY a JSON object with: cause, category, confidence, action, security_alert, redacted_summary, priority, correlation_insight."
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1}
    }
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        if response.status_code == 200:
            res_json = response.json()
            return json.loads(res_json['candidates'][0]['content']['parts'][0]['text'])
        return None
    except Exception as e:
        print(f"❌ Gemini Error: {e}")
        return None

# --- 5. PROCESS TRACE ---
def process_trace(trace_id, logs):
    print(f"🧵 ANALYZING TRACE: {trace_id}")
    analysis = analyze_logs({"logs": logs})
    if analysis:
        if len(logs) > 5: analysis['priority'] = "P0 (Auto-Escalated)"
        if db:
            try:
                db.collection("incidents").add({
                    "trace_id": trace_id,
                    "timestamp": datetime.now().isoformat(),
                    "occurrence_count": len(logs),
                    "security_alert": analysis.get('security_alert', False),
                    "redacted_text": analysis.get('redacted_summary'),
                    "priority": analysis.get('priority', 'P2'),
                    "correlation": analysis.get('correlation_insight', 'N/A'),
                    "analysis": analysis
                })
            except Exception as e: print(f"❌ Firebase Error: {e}")
        return analysis
    return None

# --- 6. LIVE WRAPPER ---
def run_analysis_for_api(time_range_minutes=60, max_traces=10):
    try:
        creds = authenticate() 
        traces = fetch_logs(creds, time_range_minutes=time_range_minutes)
        if not traces: return {"results": []}
        results = []
        for trace_id, log_list in list(traces.items())[:max_traces]:
            analysis = process_trace(trace_id, log_list)
            if analysis:
                results.append({
                    "trace_id": trace_id,
                    "category": analysis.get("category"),
                    "priority": analysis.get("priority"),
                    "log_count": len(log_list),
                    "root_cause": analysis.get("cause"),
                    "redacted_text": analysis.get("redacted_summary"),
                    "action": analysis.get("action"),
                    "correlation": analysis.get("correlation_insight"),
                    "security_alert": analysis.get("security_alert"),
                    "confidence": analysis.get("confidence")
                })
        return {"results": results}
    except Exception as e:
        return {"results": [], "error": str(e)}

if __name__ == "__main__":
    run_analysis_for_api(time_range_minutes=120, max_traces=5)