import React from 'react';
import ConfidenceRing from '../visuals/ConfidenceRing';

const SystemIntelligencePanel = ({ title, value, icon, color = 'blue', subtext }) => {
    // Map colors to visual themes
    const themes = {
        blue: { border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]' },
        indigo: { border: 'border-indigo-500/30', text: 'text-electric-blue', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]' },
        red: { border: 'border-alert-red/30', text: 'text-alert-red', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
        green: { border: 'border-success-green/30', text: 'text-success-green', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.1)]' },
    };

    const theme = themes[color] || themes.blue;

    return (
        <div className={`bg-white/5 backdrop-blur-md rounded-xl p-5 border ${theme.border} ${theme.glow} hover:bg-white/10 transition-all duration-300 relative group overflow-hidden`}>
            {/* Background Gradient */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-${color}-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-mono uppercase tracking-widest">
                        {/* Icon placeholder if needed, or just text */}
                        {icon && <span className={`w-1.5 h-1.5 rounded-full ${theme.text.replace('text-', 'bg-')}`}></span>}
                        {title}
                    </div>
                    <div className="text-3xl font-bold text-gray-100 font-mono tracking-tight animate-fade-in">
                        {value}
                    </div>
                    {subtext && (
                        <div className="text-xs text-gray-500 mt-1">
                            {subtext}
                        </div>
                    )}
                </div>

                {/* Optional Visualization Ring - pseudo-random or prop based */}
                <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* We can use a mini ring here if it makes sense, e.g. for percentages */}
                    {/* For now, just a decorative icon container */}
                    <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${theme.text}`}>
                        {/* Simple generic metric icon */}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 font-mono">
                <span>UPDATED JUST NOW</span>
                <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-success-green animate-pulse"></span>
                    LIVE
                </span>
            </div>
        </div>
    );
};

export default SystemIntelligencePanel;
