import React from 'react';
import ImpactBadge from '../visuals/ImpactBadge';

const AutomationPolicyCard = ({ rule, onEdit, onToggle, onTest }) => {
    // Generate derived policy attributes mock
    const scope = rule.severity === 'CRITICAL' ? 'Global' : (rule.severity === 'HIGH' ? 'Region (US-EAST)' : 'Service (Single)');
    const confidenceThreshold = rule.severity === 'CRITICAL' ? 95 : 80;

    return (
        <div className={`bg-white/5 backdrop-blur border rounded-xl p-0 transition-all duration-300 hover:scale-[1.01] group ${rule.enabled
            ? 'border-white/10 hover:border-electric-blue/50'
            : 'border-white/5 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
            }`}>
            {/* Header: Scope & Status */}
            <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500">#{String(rule.id).padStart(3, '0')}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/5 text-gray-400 border border-white/5">
                        Scope: {scope}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-success-green animate-pulse' : 'bg-gray-600'}`}></span>
                    <span className={`text-xs font-bold ${rule.enabled ? 'text-success-green' : 'text-gray-500'}`}>
                        {rule.enabled ? 'ACTIVE' : 'PAUSED'}
                    </span>
                </div>
            </div>

            {/* Body: Policy Definition */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trigger */}
                <div className="col-span-2">
                    <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-electric-blue transition-colors">
                        {rule.name}
                    </h3>
                    <div className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                        <span className="min-w-[70px] uppercase text-xs font-mono text-gray-500 mt-0.5">IF</span>
                        <div className="bg-black/40 px-2 py-1 rounded text-electric-blue font-mono border border-white/5">
                            error_count &gt; {rule.threshold} / {rule.window_minutes}min
                        </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="min-w-[70px] uppercase text-xs font-mono text-gray-500 mt-0.5">THEN</span>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                <span>Trigger Root Cause Analysis (Gemini)</span>
                            </div>
                            {rule.severity === 'CRITICAL' ? (
                                <div className="flex items-center gap-2 text-alert-red font-semibold">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Escalate to On-Call SRE</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-success-green">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Attempt Auto-Rollback</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Safeguards */}
                <div className="border-l border-white/5 pl-6 flex flex-col justify-center">
                    <p className="text-xs uppercase font-mono text-gray-500 mb-2">Safeguards</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Min. Confidence</span>
                            <span className="text-white font-mono">{confidenceThreshold}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Human Approval</span>
                            <span className={`font-mono ${rule.severity === 'CRITICAL' ? 'text-alert-red' : 'text-gray-500'}`}>
                                {rule.severity === 'CRITICAL' ? 'REQUIRED' : 'NO'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <ImpactBadge severity={rule.severity} />
                    </div>
                </div>
            </div>

            {/* Footer: Actions */}
            <div className="bg-white/[0.02] px-5 py-3 border-t border-white/5 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onTest(rule)}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/5 transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Test Policy
                </button>
                <div className="h-4 w-px bg-white/10 my-auto"></div>
                <button
                    onClick={() => onToggle(rule)}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/5 transition-colors"
                >
                    {rule.enabled ? 'Pause Autonomy' : 'Resume Autonomy'}
                </button>
                <div className="h-4 w-px bg-white/10 my-auto"></div>
                <button
                    onClick={() => onEdit(rule)}
                    className="text-xs text-electric-blue hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded bg-electric-blue/10 hover:bg-electric-blue/20 border border-electric-blue/20 transition-colors"
                >
                    Edit Configuration
                </button>
            </div>
        </div>
    );
};

export default AutomationPolicyCard;
