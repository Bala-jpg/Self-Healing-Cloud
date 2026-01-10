import React from 'react';
import { Link } from 'react-router-dom';

const IncidentCard = ({ incident }) => {
    const severityStyles = {
        CRITICAL: "bg-red-100 text-red-800",
        HIGH: "bg-orange-100 text-orange-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        LOW: "bg-green-100 text-green-800",
    };

    const statusStyles = {
        OPEN: "bg-blue-100 text-blue-800",
        INVESTIGATING: "bg-purple-100 text-purple-800",
        RESOLVED: "bg-gray-100 text-gray-800",
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 block hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityStyles[incident.severity] || "bg-gray-100 text-gray-800"}`}>
                    {incident.severity}
                </span>
                <span className="text-xs text-gray-500">
                    {new Date(incident.created_at).toLocaleDateString()}
                </span>
            </div>

            <Link to={`/groups/${incident.id}`} className="block">
                <h3 className="text-md font-medium text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                    {incident.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {incident.summary || "No summary available."}
                </p>
            </Link>

            <div className="flex justify-between items-center border-t pt-3 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[incident.status] || "bg-gray-100 text-gray-800"}`}>
                    {incident.status}
                </span>
                <Link
                    to={`/groups/${incident.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    View Details &rarr;
                </Link>
            </div>
        </div>
    );
};

export default IncidentCard;
