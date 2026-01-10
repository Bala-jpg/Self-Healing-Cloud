import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, groupsAPI, analysisAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import SystemIntelligencePanel from '../components/cards/SystemIntelligencePanel';
import IncidentCanvasCard from '../components/cards/IncidentCanvasCard';
import DeepDivePanel from '../components/panels/DeepDivePanel'; // Reuse for dashboard interactions

const DashboardPage = () => {
    // State for dashboard data
    const [metrics, setMetrics] = useState({
        totalErrors: 0,
        activeGroups: 0,
        criticalIssues: 0,
        resolvedToday: 0
    });
    const [recentGroups, setRecentGroups] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState(null); // For Deep Dive

    // State for Analysis Form
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStatus, setAnalysisStatus] = useState(null);
    const [analysisConfig, setAnalysisConfig] = useState({
        timeRange: '1h',
        maxTraces: 100
    });

    // Fetch Dashboard Data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoadingData(true);

                const [statsRes, groupsRes] = await Promise.allSettled([
                    analyticsAPI.summary(),
                    groupsAPI.list({ status: 'active', limit: 10 }) // Fetch more for canvas
                ]);

                // Handle Stats
                if (statsRes.status === 'fulfilled') {
                    setMetrics(statsRes.value.data);
                } else {
                    if (import.meta.env.DEV) {
                        setMetrics({
                            totalErrors: 1240,
                            activeGroups: 15,
                            criticalIssues: 3,
                            resolvedToday: 42
                        });
                    }
                }

                // Handle Groups
                if (groupsRes.status === 'fulfilled') {
                    setRecentGroups(groupsRes.value.data);
                } else {
                    if (import.meta.env.DEV) {
                        // Mock data fitting IncidentCanvasCard
                        setRecentGroups(Array(5).fill(null).map((_, i) => ({
                            id: `GRP-10${i}`,
                            name: i === 0 ? 'Database Connection Timeout' : `Downstream Latency in Service ${i}`,
                            severity: i === 0 ? 'CRITICAL' : 'HIGH',
                            count: 154 - (i * 20),
                            status: 'OPEN',
                            root_cause: { cause: 'Connection pool exhaustion detected.', confidence: 0.92 },
                            last_seen: new Date().toISOString(),
                            services: ['db-shard-01', 'payment-api'],
                            route: '/api/checkout'
                        })));
                    }
                }

            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Handle Analysis Trigger
    const handleStartAnalysis = async (e) => {
        e.preventDefault();
        setIsAnalyzing(true);
        setAnalysisStatus("Initializing AI Analysis...");

        try {
            const res = await analysisAPI.start(analysisConfig);
            const taskId = res.data.task_id || "mock-task-id";
            setAnalysisStatus("Scanning log clusters...");

            const pollInterval = setInterval(async () => {
                try {
                    let statusRes;
                    if (import.meta.env.DEV && taskId === "mock-task-id") {
                        // Mock
                        statusRes = { data: { status: Math.random() > 0.7 ? 'COMPLETED' : 'RUNNING' } };
                    } else {
                        statusRes = await analysisAPI.status(taskId);
                    }

                    if (statusRes.data.status === 'COMPLETED' || statusRes.data.status === 'FAILED') {
                        clearInterval(pollInterval);
                        setIsAnalyzing(false);
                        setAnalysisStatus(statusRes.data.status === 'COMPLETED' ? "Insights Generated." : "Analysis Failed");
                        setTimeout(() => setAnalysisStatus(null), 3000);
                    }
                } catch (e) {
                    clearInterval(pollInterval);
                    setIsAnalyzing(false);
                }
            }, 2000);
        } catch (err) {
            setIsAnalyzing(false);
            setAnalysisStatus("Failed to start");
        }
    };

    if (loadingData) return <LoadingSpinner size="lg" className="min-h-[50vh]" />;

    return (
        <div className="space-y-8">
            {/* Header / Global Context */}
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Mission Control</h1>
                    <p className="text-sm text-gray-500 font-mono mt-1">System Status: <span className="text-success-green">NOMINAL</span></p>
                </div>
                <div className="bg-black/20 px-3 py-1 rounded text-xs font-mono text-gray-500 border border-white/5">
                    REGION: US-EAST-1
                </div>
            </div>

            {/* System Intelligence Panels (Top Row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SystemIntelligencePanel
                    title="Error Rate (24h)"
                    value={metrics.totalErrors}
                    icon="trending-up"
                    color="blue"
                    subtext="+5% from yesterday"
                />
                <SystemIntelligencePanel
                    title="Active Clusters"
                    value={metrics.activeGroups}
                    icon="collection"
                    color="indigo"
                    subtext="Processing in real-time"
                />
                <SystemIntelligencePanel
                    title="Critical Events"
                    value={metrics.criticalIssues}
                    icon="exclamation"
                    color="red"
                    subtext="Immediate attention required"
                />
                <SystemIntelligencePanel
                    title="Auto-Resolved"
                    value={metrics.resolvedToday}
                    icon="check-circle"
                    color="green"
                    subtext="AI Self-Healing active"
                />
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Center: Live Incident Canvas (2/3) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-alert-red animate-pulse"></span>
                            Live Incident Canvas
                        </h2>
                        <Link to="/incidents" className="text-xs text-electric-blue hover:text-white transition-colors">
                            View All Incidents &rarr;
                        </Link>
                    </div>

                    {recentGroups.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur rounded-xl p-10 border border-white/10 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-success-green/10 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-success-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-gray-200 font-bold mb-1">System Healthy</h3>
                            <p className="text-gray-500 text-sm">No active error clusters detected.</p>
                            <div className="mt-6 flex gap-1">
                                <span className="w-1 h-6 bg-gray-700/50 rounded-full"></span>
                                <span className="w-1 h-4 bg-gray-700/50 rounded-full"></span>
                                <span className="w-1 h-8 bg-gray-700/50 rounded-full"></span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentGroups.map((group) => (
                                <IncidentCanvasCard
                                    key={group.id}
                                    group={group}
                                    onViewReasoning={() => setSelectedGroup(group)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Side: Insights & Controls (1/3) */}
                <div className="space-y-6">
                    {/* Collapsible Insights Panel */}
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                        <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-4">
                            Deep Scan Analysis
                        </h2>

                        <form onSubmit={handleStartAnalysis} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Lookback Period</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded text-gray-300 text-sm py-2 px-3 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none"
                                    value={analysisConfig.timeRange}
                                    onChange={(e) => setAnalysisConfig({ ...analysisConfig, timeRange: e.target.value })}
                                    disabled={isAnalyzing}
                                >
                                    <option value="1h">Last 1 Hour</option>
                                    <option value="6h">Last 6 Hours</option>
                                    <option value="24h">Last 24 Hours</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Max Trace Limits</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 rounded text-gray-300 text-sm py-2 px-3 focus:border-electric-blue outline-none"
                                    value={analysisConfig.maxTraces}
                                    onChange={(e) => setAnalysisConfig({ ...analysisConfig, maxTraces: e.target.value })}
                                    min="10"
                                    max="1000"
                                    disabled={isAnalyzing}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isAnalyzing}
                                className={`w-full py-2.5 px-4 rounded text-sm font-bold tracking-wide transition-all
                                    ${isAnalyzing
                                        ? 'bg-gray-700 text-gray-400 cursor-wait'
                                        : 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20 hover:bg-electric-blue/20 shadow-[0_0_15px_rgba(0,209,255,0.1)]'
                                    }
                                `}
                            >
                                {isAnalyzing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        SCANNING...
                                    </span>
                                ) : 'RUN ANALYSIS'}
                            </button>
                        </form>

                        {analysisStatus && (
                            <div className="mt-4 p-3 bg-black/30 rounded border border-white/5 text-xs font-mono text-center text-electric-blue animate-pulse">
                                {analysisStatus}
                            </div>
                        )}
                    </div>

                    {/* Mini Helper / Tip */}
                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-xl p-4">
                        <div className="flex gap-3">
                            <div className="text-xl">💡</div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-300 mb-1">Pro Tip</h4>
                                <p className="text-[10px] text-gray-500">
                                     Enable "Auto-Scan" in Alert Rules to let Gemini automatically analyze incidents severity > High.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reuse Deep Dive Panel */}
            <DeepDivePanel
                isOpen={!!selectedGroup}
                onClose={() => setSelectedGroup(null)}
                group={selectedGroup}
            />
        </div>
    );
};

export default DashboardPage;
