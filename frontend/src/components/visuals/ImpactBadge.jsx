import React from 'react';

const ImpactBadge = ({ severity, className = "" }) => {
    const styles = {
        CRITICAL: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
        HIGH: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
        MEDIUM: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
        LOW: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
        UNKNOWN: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" }
    };

    const style = styles[severity] || styles.UNKNOWN;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} ${className}`}>
            {severity}
        </span>
    );
};

export default ImpactBadge;
