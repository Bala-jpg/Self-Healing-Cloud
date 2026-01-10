import { useState, useCallback } from 'react';
import { alertsAPI } from '../services/api';

export const useAlerts = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await alertsAPI.list();
            setRules(response.data);
            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to fetch alert rules');
            console.error(err);
            if (import.meta.env.DEV) {
                setRules([
                    { id: 1, name: 'High Error Rate', enabled: true, severity: 'CRITICAL', threshold: 50, window_minutes: 5 }
                ]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const createRule = useCallback(async (data) => {
        setLoading(true);
        try {
            const response = await alertsAPI.create(data);
            setRules(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to create rule');
            if (import.meta.env.DEV) {
                const newRule = { id: Date.now(), ...data };
                setRules(prev => [...prev, newRule]);
                return newRule;
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRule = useCallback(async (id, data) => {
        setLoading(true);
        try {
            const response = await alertsAPI.update(id, data);
            setRules(prev => prev.map(r => r.id === id ? response.data : r));
            return response.data;
        } catch (err) {
            setError(err.message || 'Failed to update rule');
            if (import.meta.env.DEV) {
                setRules(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
                return { id, ...data };
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteRule = useCallback(async (id) => {
        setLoading(true);
        try {
            await alertsAPI.delete(id);
            setRules(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to delete rule');
            if (import.meta.env.DEV) {
                setRules(prev => prev.filter(r => r.id !== id));
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        rules,
        loading,
        error,
        fetchRules,
        createRule,
        updateRule,
        deleteRule
    };
};
