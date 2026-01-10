import React, { useState } from 'react';

const ActionControlPanel = ({ onAction }) => {
    const [executingState, setExecutingState] = useState(null); // 'rollback', 'fix', 'ignore'

    const handleAction = (actionType) => {
        setExecutingState(actionType);
        setTimeout(() => {
            onAction(actionType);
            setExecutingState(null);
        }, 1500);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-obsidian border-t border-white/10 p-4 pb-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] animate-slide-up">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest hidden md:block">
                        Human-in-the-Loop Control
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Secondary Actions */}
                    <button
                        onClick={() => handleAction('ignore')}
                        disabled={!!executingState}
                        className="flex-1 md:flex-none py-2 px-4 rounded border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        Mark False Positive
                    </button>

                    <button
                        onClick={() => handleAction('fix')}
                        disabled={!!executingState}
                        className="flex-1 md:flex-none py-2 px-4 rounded border border-electric-blue text-electric-blue hover:bg-electric-blue/10 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {executingState === 'fix' ? 'Applying...' : 'Apply Fix Logic'}
                    </button>

                    {/* Primary Destructive Action */}
                    <button
                        onClick={() => handleAction('rollback')}
                        disabled={!!executingState}
                        className="flex-1 md:flex-none py-2 px-6 rounded bg-alert-red hover:bg-red-600 text-white text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {executingState === 'rollback' ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                EXECUTING ROLLBACK...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                </svg>
                                INITIATE ROLLBACK
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionControlPanel;
