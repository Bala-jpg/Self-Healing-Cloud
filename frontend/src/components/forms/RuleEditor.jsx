import React, { useState, useEffect } from 'react';

const RuleEditor = ({ rule, onSave, onCancel, isSaving }) => {
    const [formData, setFormData] = useState({
        name: '',
        threshold: 10,
        window_minutes: 5,
        severity: 'MEDIUM',
        enabled: true
    });

    useEffect(() => {
        if (rule) {
            setFormData({
                name: rule.name || '',
                threshold: rule.threshold || 10,
                window_minutes: rule.window_minutes || 5,
                severity: rule.severity || 'MEDIUM',
                enabled: rule.enabled !== undefined ? rule.enabled : true
            });
        }
    }, [rule]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            threshold: parseInt(formData.threshold),
            window_minutes: parseInt(formData.window_minutes)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Rule Name</label>
                <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., High Error Spike"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Threshold (Events)</label>
                    <input
                        type="number"
                        name="threshold"
                        required
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.threshold}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Window (Minutes)</label>
                    <input
                        type="number"
                        name="window_minutes"
                        required
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.window_minutes}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Severity</label>
                <select
                    name="severity"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.severity}
                    onChange={handleChange}
                >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                </select>
            </div>

            <div className="flex items-center">
                <input
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.enabled}
                    onChange={handleChange}
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                    Rule Enabled
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Rule'}
                </button>
            </div>
        </form>
    );
};

export default RuleEditor;
