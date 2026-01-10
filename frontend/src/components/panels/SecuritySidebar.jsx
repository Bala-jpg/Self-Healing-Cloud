import React from 'react';

const SecuritySidebar = ({ isOpen, onClose }) => {
    // Mock redactions
    const redactions = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        timestamp: new Date().toISOString(),
        service: i % 2 === 0 ? 'payment-service' : 'auth-gateway',
        field: i % 3 === 0 ? 'api_key' : 'credit_card',
        action: 'REDACTED'
    }));

    return (
        <div className={`fixed inset-y-0 right-0 w-80 bg-slate-950 border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="h-16 flex items-center justify-between px-6 bg-alert-red/10 border-b border-alert-red/20">
                    <h2 className="text-sm font-bold text-alert-red uppercase tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Security Guard
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {redactions.map(item => (
                        <div key={item.id} className="bg-black/40 border border-white/5 rounded p-3 text-xs font-mono">
                            <div className="flex justify-between text-gray-500 mb-1">
                                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                <span className="text-electric-blue">{item.service}</span>
                            </div>
                            <div className="text-gray-300">
                                Protected <span className="text-alert-red">{item.field}</span> from exposure.
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SecuritySidebar;
