import os
import json
import requests
import time
from datetime import datetime
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# --- 1. LOAD CONFIG ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# As per your list_models.py, we use this powerful Gemini 3 model
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY}"

# --- 2. INITIALIZE FIREBASE SAFELY ---
def init_firebase():
    """Initializes the default Firebase app if not already existing."""
    if not firebase_admin._apps:
        key_path = "serviceAccountKey.json"
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            # We initialize as the [DEFAULT] app to avoid the ValueError
            firebase_admin.initialize_app(cred)
            print("Firebase initialized successfully.")
            return firestore.client()
        else:
            print("serviceAccountKey.json not found! Firebase will be skipped.")
            return None
    return firestore.client()

db = init_firebase()

# --- 3. THE BRAIN: CALL GEMINI VIA REST ---
def analyze_logs(log_data):
    """Uses Gemini 3 to diagnose the root cause."""
    print("Analyzing logs with Gemini 3 Flash...")
    
    prompt = (
        "You are an SRE Agent. Analyze these Cloud Run error logs. "
        "Return ONLY a JSON object with keys: 'cause', 'category', 'confidence', 'action'. "
        f"Logs: {json.dumps(log_data)}"
    )
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.1
        }
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        if response.status_code == 200:
            res_json = response.json()
            raw_text = res_json['candidates'][0]['content']['parts'][0]['text']
            return json.loads(raw_text)
        elif response.status_code == 429:
            print("Rate limit hit. Please wait a moment.")
            return None
        else:
            print(f"API Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

# --- 4. THE ORCHESTRATOR ---
def run_prototype():
    # Load Logs
    log_file = "data/mock_logs.json"
    if not os.path.exists(log_file):
        print(f"Missing file: {log_file}")
        return

    with open(log_file, "r") as f:
        logs = json.load(f)

    print("Mock logs loaded into memory.")

    # Get AI Analysis
    analysis = analyze_logs(logs)
    
    if analysis:
        print("\n" + "="*30)
        print(f"ROOT CAUSE: {analysis['cause']}")
        print(f"CATEGORY: {analysis['category']}")
        print(f"ACTION: {analysis['action']}")
        print("="*30)

        # Push to Firebase
        if db:
            try:
                doc_ref = db.collection("incidents").add({
                    "timestamp": datetime.now().isoformat(),
                    "service": "payment-api",
                    "analysis": analysis,
                    "status": "AUTO-RESOLVED" if analysis['confidence'] > 0.8 else "PENDING_REVIEW"
                })
                print(f"Firebase updated! (Doc ID: {doc_ref[1].id})")
            except Exception as e:
                print(f"Failed to update Firebase: {e}")
    else:
        print("Analysis failed. Check API Key or Quota.")

if __name__ == "__main__":
    run_prototype()