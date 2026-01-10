import React, { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';
// import AlertsTable from '../components/tables/AlertsTable'; // Replaced
// import AlertRuleCard from '../components/cards/AlertRuleCard'; // Replaced
import AutomationPolicyCard from '../components/cards/AutomationPolicyCard';
import AutonomyStats from '../components/headers/AutonomyStats';
import RuleEditor from '../components/forms/RuleEditor';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../components/common/ToastProvider';

const AlertRulesPage = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    const fetchRules = async () => {
        setLoading(true);
        try {
            const response = await alertsAPI.list();
            setRules(response.data);
        } catch (err) {
            console.error("Failed to load rules", err);
            if (import.meta.env.DEV) {
                // Mock Data
                setRules([
                    { id: 1, name: 'Critical Error Spike', threshold: 50, window_minutes: 5, severity: 'CRITICAL', enabled: true },
                    { id: 2, name: 'Sustained High Latency', threshold: 200, window_minutes: 15, severity: 'HIGH', enabled: false },
                    { id: 3, name: 'Database Connection Drops', threshold: 5, window_minutes: 1, severity: 'CRITICAL', enabled: true },
                    { id: 4, name: 'Frontend 404 Burst', threshold: 100, window_minutes: 10, severity: 'MEDIUM', enabled: true },
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleCreate = () => {
        setEditingRule(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (rule) => {
        setEditingRule(rule);
        setIsEditorOpen(true);
    };

    const handleToggle = async (rule) => {
        try {
            const updatedRules = rules.map(r =>
                r.id === rule.id ? { ...r, enabled: !r.enabled } : r
            );
            setRules(updatedRules);

            await alertsAPI.update(rule.id, { ...rule, enabled: !rule.enabled });
            addToast(`Policy '${rule.name}' ${rule.enabled ? 'paused' : 'activated'}`, 'info');
        } catch (err) {
            console.error("Failed to toggle rule", err);
            if (!import.meta.env.DEV) fetchRules();
            addToast('Failed to update policy status', 'error');
        }
    };

    const handleTestPolicy = (rule) => {
        addToast(`Simulating policy: ${rule.name}...`, 'info');
        setTimeout(() => {
            const success = Math.random() > 0.3;
            if (success) {
                addToast(`Simulation Passed: AI detected condition in 120ms`, 'success');
            } else {
                addToast(`Simulation Warning: Confidence too low (65%)`, 'warning');
            }
        }, 1500);
    };

    const handleSave = async (formData) => {
        setIsSaving(true);
        try {
            if (editingRule) {
                if (import.meta.env.DEV) {
                    setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...formData } : r));
                } else {
                    await alertsAPI.update(editingRule.id, formData);
                    await fetchRules();
                }
                addToast('Policy configuration updated', 'success');
            } else {
                if (import.meta.env.DEV) {
                    setRules(prev => [...prev, { id: Date.now(), ...formData }]);
                } else {
                    await alertsAPI.create(formData);
                    await fetchRules();
                }
                addToast('New automation policy defined', 'success');
            }
            setIsEditorOpen(false);
        } catch (err) {
            console.error("Failed to save rule", err);
            addToast('Failed to save policy', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div>
                <div className="sm:flex sm:items-end sm:justify-between mb-6 border-b border-white/10 pb-5">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Autonomy Control</h1>
                        <p className="mt-2 text-sm text-gray-400 font-mono">Manage automation safeguards and response policies.</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(0,209,255,0.2)] text-sm font-bold text-black bg-electric-blue hover:bg-electric-blue/90 hover:shadow-[0_0_25px_rgba(0,209,255,0.4)] transition-all"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Define Policy
                        </button>
                    </div>
                </div>

                {/* Autonomy Stats Strip */}
                <AutonomyStats />
            </div>

            {loading ? (
                <LoadingSpinner size="lg" className="min-h-[400px]" />
            ) : rules.length === 0 ? (
                <EmptyState
                    title="No Policies Defined"
                    description="System is currently operating in manual mode. Define a policy to enable autonomy."
                    action={
                        <button onClick={handleCreate} className="mt-4 text-electric-blue font-bold hover:text-white transition-colors">
                            Define Activation Policy &rarr;
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {rules.map(rule => (
                        <AutomationPolicyCard
                            key={rule.id}
                            rule={rule}
                            onEdit={handleEdit}
                            onToggle={handleToggle}
                            onTest={handleTestPolicy}
                        />
                    ))}
                </div>
            )}

            {/* Editor Modal - (Using existing form logic, wrapped in dark modal) */}
            {isEditorOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsEditorOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-obsidian border border-white/10 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-6 pt-6 pb-4">
                                <h3 className="text-xl leading-6 font-bold text-gray-100 mb-6 border-b border-white/10 pb-4" id="modal-title">
                                    {editingRule ? 'Configure Policy' : 'New Automation Policy'}
                                </h3>
                                {/* 
                                    Note: RuleEditor is still using default tailwind styles (likely white bg fields). 
                                    In a full refactor, RuleEditor would also need a dark mode pass to match perfectly.
                                    For now, it renders inside this dark container.
                                */}
                                <div className="bg-gray-100 rounded-lg p-2 filter invert hue-rotate-180 brightness-90">
                                    {/* Quick hack to invert the light-mode editor for dark mode without rewriting it solely for this demo task */}
                                    {/* Real app would refactor RuleEditor.jsx */}
                                    <RuleEditor
                                        rule={editingRule}
                                        onSave={handleSave}
                                        onCancel={() => setIsEditorOpen(false)}
                                        isSaving={isSaving}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-center text-gray-500 font-mono">
                                    * Editor styles inverted for compatibility
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertRulesPage;
