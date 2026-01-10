import React from 'react';

const PlaybookViewer = ({ title, steps = [] }) => {
    // Helper to render code blocks within steps
    const renderStepContent = (content) => {
        // Simple regex to detect markdown-style code blocks ```code```
        const parts = content.split(/```/);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                // This is code
                return (
                    <div key={index} className="mt-2 mb-2 bg-slate-900 text-slate-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                        <pre>{part.trim()}</pre>
                    </div>
                );
            }
            // This is text
            return <span key={index} className="whitespace-pre-wrap">{part}</span>;
        });
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-indigo-900">
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Remediation Playbook
                    </span>
                </h3>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                    {steps.length === 0 ? (
                        <div className="px-4 py-5 sm:gap-4 sm:px-6 text-gray-500 italic">
                            No automatic fix steps available for this issue yet.
                        </div>
                    ) : (
                        steps.map((step, idx) => (
                            <div key={idx} className={idx % 2 === 0 ? 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6' : 'bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'}>
                                <dt className="text-sm font-medium text-gray-500 flex items-start gap-2">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">
                                        {idx + 1}
                                    </div>
                                    Step {idx + 1}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {renderStepContent(step)}
                                </dd>
                            </div>
                        ))
                    )}
                </dl>
            </div>
        </div>
    );
};

export default PlaybookViewer;
