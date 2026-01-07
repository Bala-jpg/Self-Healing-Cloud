import requests
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

# This endpoint tells you exactly what models YOU can use
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

response = requests.get(url)
if response.status_code == 200:
    for m in response.json()['models']:
        print(f"✅ Available: {m['name']}")
else:
    print(f"❌ Error: {response.text}")