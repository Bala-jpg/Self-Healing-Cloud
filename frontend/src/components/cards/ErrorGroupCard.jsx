import React from 'react';
import ImpactBadge from '../visuals/ImpactBadge';

const ErrorGroupCard = ({ group, onStatusToggle }) => {
    if (!group) return null;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:px-6 mb-6">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <ImpactBadge severity={group.severity} />
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${group.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {group.status}
                        </span>
                        <span className="text-xs text-gray-500">ID: {group.id}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h1>
                    <p className="text-gray-600 text-sm max-w-3xl">
                        {group.summary || "No summary available for this error group."}
                    </p>
                </div>

                <div className="ml-4 flex-shrink-0 flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500">
                        First seen: <span className="font-medium text-gray-900">{new Date(group.first_seen).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total events: <span className="font-medium text-gray-900">{group.count}</span>
                    </div>

                    {onStatusToggle && (
                        <button
                            onClick={onStatusToggle}
                            className={`mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${group.status === 'OPEN'
                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                }`}
                        >
                            {group.status === 'OPEN' ? 'Mark Resolved' : 'Re-open Issue'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorGroupCard;
