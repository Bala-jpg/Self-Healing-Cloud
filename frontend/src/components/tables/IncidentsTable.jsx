import React from 'react';
import { Link } from 'react-router-dom';

const IncidentsTable = ({ incidents }) => {
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
        <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Severity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Issue
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {incidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {incident.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityStyles[incident.severity] || "bg-gray-100 text-gray-800"}`}>
                                    {incident.severity}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{incident.name}</div>
                                <div className="text-sm text-gray-500">{incident.summary ? incident.summary.substring(0, 50) + "..." : "No summary"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[incident.status] || "bg-gray-100 text-gray-800"}`}>
                                    {incident.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(incident.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/groups/${incident.id}`} className="text-indigo-600 hover:text-indigo-900">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncidentsTable;
