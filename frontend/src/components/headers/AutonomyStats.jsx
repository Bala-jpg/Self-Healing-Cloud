import React from 'react';

const AutonomyStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Active Policies */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Active Policies</p>
                    <p className="text-2xl font-bold text-gray-100 mt-1">12</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
            </div>

            {/* Auto-Actions */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Auto-Actions (24h)</p>
                    <p className="text-2xl font-bold text-success-green mt-1">84</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center text-success-green">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>

            {/* Escalations */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Human Escalations</p>
                    <p className="text-2xl font-bold text-alert-red mt-1">3</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-alert-red/10 flex items-center justify-center text-alert-red">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            </div>

            {/* Global Switch */}
            <div className="bg-electric-blue/5 border border-electric-blue/30 rounded-lg p-4 flex items-center justify-between hover:bg-electric-blue/10 transition-colors cursor-pointer group shadow-[0_0_15px_rgba(0,209,255,0.1)]">
                <div>
                    <p className="text-xs text-electric-blue font-mono uppercase tracking-wider font-bold group-hover:text-white transition-colors">Global Autonomy</p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
                        SYSTEM ACTIVE
                    </p>
                </div>
                <div className="flex items-center">
                    <div className="w-12 h-6 bg-electric-blue rounded-full p-1 flex justify-end">
                        <div className="w-4 h-4 bg-black rounded-full shadow-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutonomyStats;
