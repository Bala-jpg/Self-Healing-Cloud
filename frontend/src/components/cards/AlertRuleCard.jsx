import React from 'react';
import ImpactBadge from '../visuals/ImpactBadge';

const AlertRuleCard = ({ rule, onEdit, onToggle }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-medium text-gray-900">{rule.name}</h3>
                <ImpactBadge severity={rule.severity} />
            </div>

            <div className="text-sm text-gray-500 mb-4">
                <p>Threshold: &gt; {rule.threshold} events</p>
                <p>Window: {rule.window_minutes} minutes</p>
            </div>

            <div className="flex justify-between items-center border-t pt-3">
                <button
                    onClick={() => onToggle(rule)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${rule.enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={rule.enabled}
                >
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>

                <button
                    onClick={() => onEdit(rule)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Edit Rule
                </button>
            </div>
        </div>
    );
};

export default AlertRuleCard;
