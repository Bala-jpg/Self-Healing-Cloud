import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupsAPI, incidentsAPI } from '../services/api';
// import ErrorGroupCard from '../components/cards/ErrorGroupCard'; // Replaced by Header
// import PlaybookViewer from '../components/visuals/PlaybookViewer'; // Integrated into Canvas
// import IncidentTimeline from '../components/visuals/IncidentTimeline'; // Integrated into Canvas
import IncidentCommandHeader from '../components/incident/IncidentCommandHeader';
import InvestigationCanvas from '../components/incident/InvestigationCanvas';
import ActionControlPanel from '../components/incident/ActionControlPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/ToastProvider';

const GroupDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState(null);
    const [incidents, setIncidents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            setLoading(true);
            try {
                // Fetch details
                const groupRes = await groupsAPI.detail(id);
                setGroup(groupRes.data);

                // Fetch incidents
                const incidentsRes = await incidentsAPI.list({ group_id: id, limit: 20 });
                setIncidents(incidentsRes.data);

            } catch (err) {
                console.error("Failed to load group details", err);
                if (import.meta.env.DEV) {
                    // Mock group for dev
                    setGroup({
                        id: id || "GRP-2941",
                        name: "Payment Gateway Latency Spike",
                        severity: "CRITICAL",
                        status: "OPEN",
                        summary: "Connection refused from 192.168.1.10 over port 5432.",
                        count: 42,
                        first_seen: new Date(Date.now() - 172800000).toISOString(),
                        root_cause: {
                            cause: "Upstream API Timeout (Stripe)",
                            confidence: 0.95,
                            evidence: ["TimeoutError: 3000ms exceeded", "Connection reset by peer"]
                        }
                    });

                    // Mock incidents
                    setIncidents([
                        ...Array(10).fill().map((_, i) => ({
                            id: `INC-${i}`,
                            created_at: new Date(Date.now() - (i * 1000 * 60 * 15)).toISOString(),
                            status: 'OPEN'
                        }))
                    ]);

                } else {
                    setError("Failed to load group details. It may not exist.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGroupDetails();
        }
    }, [id]);

    const handleAction = (actionType) => {
        if (actionType === 'rollback') {
            addToast('Rollback initiated successfully. Monitoring stability...', 'success');
            setGroup(prev => ({ ...prev, status: 'RESOLVED' }));
        } else if (actionType === 'fix') {
            addToast('Applied recommended remediation logic.', 'info');
        } else if (actionType === 'ignore') {
            addToast('Marked as false positive. Learning updated.', 'warning');
            navigate('/incidents');
        }
    };

    if (loading) return <LoadingSpinner size="lg" className="min-h-[100vh]" />;

    if (error) return (
        <div className="text-center py-24">
            <div className="text-alert-red mb-4 text-xl">{error}</div>
            <button onClick={() => navigate('/dashboard')} className="text-electric-blue hover:text-white font-medium">
                &larr; Return to Mission Control
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-obsidian pb-32"> {/* pb-32 for sticky footer space */}

            {/* Zone 1: Situation Awareness */}
            <IncidentCommandHeader group={group} />

            {/* Zone 2: Investigation Canvas */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <InvestigationCanvas group={group} incidents={incidents} />
            </div>

            {/* Zone 3: Control Panel */}
            <ActionControlPanel onAction={handleAction} />
        </div>
    );
};

export default GroupDetailPage;
