import React, { useEffect } from 'react';

const Toast = ({ id, message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, onClose, duration]);

    const variants = {
        success: {
            icon: '🚀',
            border: 'border-success-green',
            bg: 'bg-gradient-to-r from-success-green/10 to-transparent'
        },
        warning: {
            icon: '⚠️',
            border: 'border-yellow-500',
            bg: 'bg-gradient-to-r from-yellow-500/10 to-transparent'
        },
        info: {
            icon: '🤖',
            border: 'border-electric-blue',
            bg: 'bg-gradient-to-r from-electric-blue/10 to-transparent'
        },
        error: {
            icon: '🚨',
            border: 'border-alert-red',
            bg: 'bg-gradient-to-r from-alert-red/10 to-transparent'
        }
    };

    const style = variants[type] || variants.info;

    return (
        <div className={`mb-3 w-80 rounded-lg border-l-4 ${style.border} ${style.bg} bg-obsidian/90 backdrop-blur-md text-white shadow-lg p-4 flex items-start transform transition-all duration-500 animate-slide-in-right`}>
            <span className="text-xl mr-3">{style.icon}</span>
            <div className="flex-1">
                <p className="text-sm font-semibold mb-1">{type === 'success' ? 'System Update' : 'Alert'}</p>
                <p className="text-xs text-gray-300">{message}</p>
            </div>
            <button onClick={() => onClose(id)} className="text-gray-500 hover:text-white ml-2">
                ✕
            </button>
        </div>
    );
};

export default Toast;
