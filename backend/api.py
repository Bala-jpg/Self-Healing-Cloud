<<<<<<< HEAD
=======
# api.py - FastAPI with beautiful dashboard (errors only)
>>>>>>> c390916490281795dd24c95a3810f14d6287396c
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional
import sys

# Import the agent
from agent import run_analysis_for_api

app = FastAPI(title="Cloud RCA Dashboard")

<<<<<<< HEAD
=======

>>>>>>> c390916490281795dd24c95a3810f14d6287396c
# --- MODELS ---
class AnalyzeRequest(BaseModel):
    time_range_minutes: int = 60
    max_traces: Optional[int] = 10

<<<<<<< HEAD
# --- UPDATED HTML DASHBOARD ---
=======

# --- BEAUTIFUL HTML DASHBOARD ---
>>>>>>> c390916490281795dd24c95a3810f14d6287396c
HTML_DASHBOARD = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<<<<<<< HEAD
    <title>Cloud RCA - Intelligent Command Center</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .slide-in { animation: slideIn 0.4s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .blur-text { filter: blur(4px); transition: filter 0.3s; cursor: help; }
        .blur-text:hover { filter: blur(0); }
    </style>
</head>
<body class="bg-slate-50 min-h-screen">
    
    <div class="bg-slate-900 text-white shadow-xl">
        <div class="container mx-auto px-6 py-6 max-w-7xl flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-extrabold flex items-center gap-3">
                    <span class="text-4xl">🛡️</span> Cloud RCA Agent
                </h1>
                <p class="text-slate-400">Security-First Autonomous Reliability Hub</p>
            </div>
            <div class="flex gap-4">
                <div id="statsPII" class="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-lg text-red-400 text-sm font-bold hidden">
                    🚨 PII Blocked
=======
    <title>Cloud RCA - Root Cause Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .slide-in {
            animation: slideIn 0.4s ease-out forwards;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        .gradient-border {
            position: relative;
            background: linear-gradient(white, white) padding-box,
                        linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
            border: 3px solid transparent;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
    
    <!-- Header with Gradient -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div class="container mx-auto px-6 py-8 max-w-7xl">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-4xl font-extrabold mb-2 flex items-center gap-3">
                        <span class="text-5xl">🔍</span>
                        Cloud RCA Dashboard
                    </h1>
                    <p class="text-indigo-100 text-lg">Intelligent Root Cause Analysis powered by Gemini AI</p>
                </div>
                <div class="hidden md:flex items-center gap-4">
                    <div class="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-lg">
                        <div class="text-xs text-indigo-100">Powered by</div>
                        <div class="text-sm font-bold">Google Cloud + Gemini</div>
                    </div>
>>>>>>> c390916490281795dd24c95a3810f14d6287396c
                </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-6 py-8 max-w-7xl">
<<<<<<< HEAD
        <div class="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-200">
            <div class="grid md:grid-cols-3 gap-6">
                <div>
                    <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Time Range (Min)</label>
                    <input type="number" id="timeRange" value="60" class="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Max Traces</label>
                    <input type="number" id="maxTraces" value="10" class="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="flex items-end">
                    <button onclick="analyzeLog()" id="analyzeBtn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-all shadow-lg shadow-indigo-200">
                        🚀 Run Deep Analysis
                    </button>
                </div>
            </div>
        </div>

        <div id="resultsSection" class="hidden">
            <div id="resultsContainer" class="grid grid-cols-1 gap-6"></div>
        </div>

        <div id="loadingIndicator" class="hidden text-center py-20">
            <div class="animate-spin text-5xl mb-4">⚙️</div>
            <p class="text-slate-600 font-medium italic">Gemini is correlating patterns and scrubbing PII...</p>
=======
        
        <!-- Control Panel - Modern Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    ⚙️
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Analysis Configuration</h2>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label class="block text-sm font-semibold mb-2 text-gray-700">
                        🕐 Time Range (minutes)
                    </label>
                    <input 
                        type="number" 
                        id="timeRange" 
                        value="60" 
                        min="1" 
                        max="1440"
                        class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition text-lg font-semibold">
                </div>
                
                <div>
                    <label class="block text-sm font-semibold mb-2 text-gray-700">
                        📊 Max Traces to Analyze
                    </label>
                    <input 
                        type="number" 
                        id="maxTraces" 
                        value="10" 
                        min="1" 
                        max="50"
                        class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition text-lg font-semibold">
                </div>
                
                <div class="flex items-end">
                    <button 
                        id="analyzeBtn"
                        onclick="analyzeLog()"
                        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                        🚀 Start Analysis
                    </button>
                </div>
            </div>

            <!-- Error Message -->
            <div id="errorMsg" class="hidden p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
            </div>

            <!-- Loading Indicator -->
            <div id="loadingIndicator" class="hidden bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-indigo-200">
                <div class="flex items-center gap-4">
                    <div class="text-4xl animate-spin">⏳</div>
                    <div>
                        <div class="font-bold text-indigo-900 text-lg">Analyzing Logs...</div>
                        <div class="text-indigo-600">OAuth authentication popup will appear. This may take a moment.</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Section -->
        <div id="resultsSection" class="hidden">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <span class="text-4xl">🎯</span>
                    Error Analysis Results
                </h2>
                <span id="resultsCount" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg"></span>
            </div>
            <div id="resultsContainer" class="space-y-6">
                <!-- Results will be inserted here -->
            </div>
        </div>

        <!-- Empty State - Beautiful -->
        <div id="emptyState" class="text-center py-20">
            <div class="mb-6">
                <div class="inline-block bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-3xl">
                    <div class="text-8xl">📋</div>
                </div>
            </div>
            <h3 class="text-3xl font-bold text-gray-800 mb-4">Ready to Analyze Logs</h3>
            <p class="text-xl text-gray-600 mb-2">Configure your time range and click "Start Analysis"</p>
            <p class="text-gray-500">You'll authenticate with GCP when the analysis begins</p>
        </div>
    </div>

    <!-- Footer -->
    <div class="container mx-auto px-6 py-8 max-w-7xl">
        <div class="text-center text-gray-500 text-sm">
            <p>🔒 Secure OAuth Authentication • 🤖 AI-Powered Analysis • ☁️ Google Cloud Platform</p>
>>>>>>> c390916490281795dd24c95a3810f14d6287396c
        </div>
    </div>

    <script>
        async function analyzeLog() {
<<<<<<< HEAD
            const btn = document.getElementById('analyzeBtn');
            const loader = document.getElementById('loadingIndicator');
            const container = document.getElementById('resultsContainer');
            const section = document.getElementById('resultsSection');

            loader.classList.remove('hidden');
            section.classList.add('hidden');
            btn.disabled = true;
=======
            const timeRange = document.getElementById('timeRange').value;
            const maxTraces = document.getElementById('maxTraces').value;
            const analyzeBtn = document.getElementById('analyzeBtn');
            const loadingIndicator = document.getElementById('loadingIndicator');
            const errorMsg = document.getElementById('errorMsg');
            
            // Reset UI
            errorMsg.classList.add('hidden');
            loadingIndicator.classList.remove('hidden');
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<span class="animate-spin inline-block">⏳</span> Analyzing...';
>>>>>>> c390916490281795dd24c95a3810f14d6287396c

            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
<<<<<<< HEAD
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        time_range_minutes: parseInt(document.getElementById('timeRange').value),
                        max_traces: parseInt(document.getElementById('maxTraces').value)
                    })
                });
                const data = await response.json();
                renderResults(data.results);
            } catch (e) {
                alert("Analysis Error: " + e);
            } finally {
                loader.classList.add('hidden');
                section.classList.remove('hidden');
                btn.disabled = false;
            }
        }

        function renderResults(results) {
    const container = document.getElementById('resultsContainer');
    const statsPII = document.getElementById('statsPII');
    
    if (!results || results.length === 0) {
        container.innerHTML = "<div class='text-center py-20 text-slate-400'>✅ Systems Operational</div>";
        return;
    }

    // Sort to put P0 at the very top
    results.sort((a, b) => (a.priority.includes('P0') ? -1 : 1));

    container.innerHTML = results.map((res) => {
        const isCritical = res.priority && res.priority.includes('P0');
        
        // Show Global PII Alert Badge if security_alert is true
        if (res.security_alert) statsPII.classList.remove('hidden');

        return `
        ${isCritical ? `
        <div class="bg-red-600 text-white p-4 rounded-t-2xl flex items-center gap-4 animate-pulse border-b-4 border-red-800">
            <span class="text-2xl">🚨</span>
            <div class="flex-1">
                <p class="text-xs font-black uppercase tracking-widest opacity-80">Critical System Escalation</p>
                <p class="text-lg font-bold">Priority ${res.priority}: Immediate Action Required</p>
            </div>
            <div class="text-xs font-mono bg-black/20 px-2 py-1 rounded">TR-ID: ${res.trace_id}</div>
        </div>
        ` : ''}

        <div class="bg-white border-x border-b border-slate-200 ${isCritical ? 'rounded-b-2xl' : 'rounded-2xl'} shadow-2xl mb-10 overflow-hidden">
            
            <div class="p-6">
                <div class="flex items-start gap-4 p-5 bg-indigo-50 rounded-2xl border-2 border-indigo-100 mb-6">
                    <div class="bg-indigo-600 text-white p-3 rounded-xl text-xl">🔗</div>
                    <div>
                        <h4 class="text-indigo-900 font-black text-xs uppercase tracking-tighter">AI Correlation Alert</h4>
                        <p class="text-indigo-800 text-md leading-relaxed mt-1 italic font-medium">
                            "${res.correlation}"
                        </p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <h4 class="text-slate-400 font-bold text-[10px] uppercase mb-2">Root Cause Analysis</h4>
                            <p class="text-slate-800 font-semibold text-lg">${res.root_cause}</p>
                        </div>
                        <div class="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                            <h4 class="text-emerald-600 font-bold text-[10px] uppercase mb-2">AI Suggested Remediation</h4>
                            <p class="text-emerald-900 font-black">${res.action}</p>
                        </div>
                    </div>

                    <div class="bg-slate-900 rounded-2xl p-6 relative">
                         <div class="absolute top-4 right-4 flex gap-2">
                            ${res.security_alert ? '<span class="bg-red-500 text-[10px] text-white px-2 py-1 rounded font-black shadow-lg">🛡️ SHIELD ACTIVE</span>' : ''}
                         </div>
                        <h4 class="text-slate-500 font-bold text-[10px] uppercase mb-4">Redacted Intelligence Summary</h4>
                        <div class="font-mono text-sm text-blue-300 whitespace-pre-line leading-relaxed">
                            ${res.redacted_text}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}
=======
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        time_range_minutes: parseInt(timeRange),
                        max_traces: parseInt(maxTraces)
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Analysis failed: ${errorText}`);
                }

                const data = await response.json();
                
                // Filter only traces with actual errors (not just INFO logs)
                const errorTraces = data.results.filter(r => 
                    r.category !== 'Informational' && 
                    r.category !== 'Healthy/Operational' &&
                    r.confidence < 1.0  // Exclude 100% confidence "no error" results
                );
                
                displayResults(errorTraces);
                
            } catch (error) {
                errorMsg.innerHTML = '<strong>❌ Error:</strong> ' + error.message;
                errorMsg.classList.remove('hidden');
            } finally {
                loadingIndicator.classList.add('hidden');
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '🚀 Start Analysis';
            }
        }

        function displayResults(results) {
            const container = document.getElementById('resultsContainer');
            const section = document.getElementById('resultsSection');
            const emptyState = document.getElementById('emptyState');
            const count = document.getElementById('resultsCount');

            if (results.length === 0) {
                emptyState.innerHTML = `
                    <div class="mb-6">
                        <div class="inline-block bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-3xl">
                            <div class="text-8xl">✅</div>
                        </div>
                    </div>
                    <h3 class="text-3xl font-bold text-gray-800 mb-4">No Errors Found!</h3>
                    <p class="text-xl text-green-600 mb-2">All systems are operating normally</p>
                    <p class="text-gray-500">Your logs show no critical issues in the selected time range</p>
                `;
                emptyState.classList.remove('hidden');
                section.classList.add('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            section.classList.remove('hidden');
            count.textContent = `${results.length} Error${results.length > 1 ? 's' : ''} Found`;

            container.innerHTML = results.map((result, idx) => {
                const confidencePercent = Math.round(result.confidence * 100);
                const confidenceColor = 
                    confidencePercent >= 80 ? 'from-green-500 to-emerald-600' : 
                    confidencePercent >= 60 ? 'from-yellow-500 to-orange-600' : 
                    'from-red-500 to-rose-600';
                const bgColor = 
                    confidencePercent >= 80 ? 'from-green-50 to-emerald-50' : 
                    confidencePercent >= 60 ? 'from-yellow-50 to-orange-50' : 
                    'from-red-50 to-rose-50';

                return `
                    <div class="slide-in bg-gradient-to-br ${bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-gray-100" style="animation-delay: ${idx * 0.1}s">
                        
                        <!-- Header -->
                        <div class="flex justify-between items-start mb-6">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-3">
                                    <span class="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                                        Error #${idx + 1}
                                    </span>
                                    <span class="bg-gradient-to-r ${confidenceColor} text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                                        ${result.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="text-right ml-6">
                                <div class="bg-white rounded-2xl px-6 py-4 shadow-lg">
                                    <div class="text-5xl font-black bg-gradient-to-r ${confidenceColor} bg-clip-text text-transparent">
                                        ${confidencePercent}%
                                    </div>
                                    <div class="text-xs text-gray-600 uppercase tracking-wide font-bold mt-1">Confidence</div>
                                </div>
                            </div>
                        </div>

                        <!-- Root Cause -->
                        <div class="bg-white/80 backdrop-blur rounded-xl p-6 mb-4 shadow-md">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 bg-gradient-to-br ${confidenceColor} rounded-lg flex items-center justify-center text-white text-xl">
                                    🔍
                                </div>
                                <div class="font-bold text-gray-900 text-lg">Root Cause</div>
                            </div>
                            <div class="text-gray-800 text-lg leading-relaxed pl-13">
                                ${result.root_cause}
                            </div>
                        </div>

                        <!-- Recommended Fix -->
                        <div class="bg-white/80 backdrop-blur rounded-xl p-6 shadow-md">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                                    💡
                                </div>
                                <div class="font-bold text-gray-900 text-lg">How to Fix</div>
                            </div>
                            <div class="text-gray-800 text-lg leading-relaxed pl-13">
                                ${result.action}
                            </div>
                        </div>

                        <!-- Footer Info -->
                        <div class="mt-6 flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2 text-gray-600 bg-white/60 px-4 py-2 rounded-lg">
                                <span class="font-mono text-xs">${result.trace_id.substring(0, 16)}...</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600 bg-white/60 px-4 py-2 rounded-lg font-semibold">
                                📝 ${result.log_count} logs analyzed
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
>>>>>>> c390916490281795dd24c95a3810f14d6287396c
    </script>
</body>
</html>
"""

<<<<<<< HEAD
=======

>>>>>>> c390916490281795dd24c95a3810f14d6287396c
# --- API ENDPOINTS ---

@app.get("/", response_class=HTMLResponse)
async def dashboard():
<<<<<<< HEAD
    return HTML_DASHBOARD

@app.post("/api/analyze")
async def analyze_logs_endpoint(request: AnalyzeRequest):
    try:
        # result = { "results": [ { "priority": "P0", "correlation": "...", "security_alert": True, ... } ] }
=======
    """Serve the beautiful HTML dashboard"""
    return HTML_DASHBOARD


@app.post("/api/analyze")
async def analyze_logs_endpoint(request: AnalyzeRequest):
    """
    Call agent.py to analyze logs and return only error traces
    """
    try:
        print(f"\n{'='*80}")
        print(f"📥 API Request: Analyze logs (last {request.time_range_minutes} minutes, max {request.max_traces} traces)")
        print(f"{'='*80}\n")
        
        # Call the agent
>>>>>>> c390916490281795dd24c95a3810f14d6287396c
        result = run_analysis_for_api(
            time_range_minutes=request.time_range_minutes,
            max_traces=request.max_traces
        )
<<<<<<< HEAD
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 DASHBOARD STARTING...")
    # Using 127.0.0.1 is often more stable for local testing
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
=======
        
        # Filter to only return actual errors (not INFO or health checks)
        if result.get("results"):
            error_results = [
                r for r in result["results"]
                if r.get("category") not in ["Informational", "Healthy/Operational"]
                and r.get("confidence", 0) < 1.0  # Exclude 100% confidence "no error"
            ]
            result["results"] = error_results
            result["analyzed_traces"] = len(error_results)
            result["message"] = f"Found {len(error_results)} error(s)"
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Cloud RCA Dashboard"}


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Cloud RCA Dashboard...")
    print("📍 Dashboard: http://localhost:8000")
    print("⚠️  OAuth popup will appear when you click 'Start Analysis'\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
>>>>>>> c390916490281795dd24c95a3810f14d6287396c
