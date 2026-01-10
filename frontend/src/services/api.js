import axios from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API Services
export const authAPI = {
    setup: (config) => api.post('/auth/setup', config),
    login: (credentials) => api.post('/auth/login', credentials),
    status: () => api.get('/auth/status'),
};

// Analysis API Services
export const analysisAPI = {
    start: (clusterId) => api.post('/analyze/start', { cluster_id: clusterId }),
    status: (taskId) => api.get(`/analyze/status/${taskId}`),
};

// Incidents API Services
export const incidentsAPI = {
    list: (params) => api.get('/incidents', { params }),
    detail: (id) => api.get(`/incidents/${id}`),
};

// Groups API Services
export const groupsAPI = {
    list: (params) => api.get('/groups', { params }), // Allow passing query params like { status: 'active' }
    detail: (id) => api.get(`/groups/${id}`),
    playbook: (id) => api.get(`/groups/${id}/playbook`),
};

// Analytics API Services
export const analyticsAPI = {
    summary: () => api.get('/analytics/summary'),
    trends: () => api.get('/analytics/trends'),
};

// Alerts API Services
export const alertsAPI = {
    list: () => api.get('/alerts/rules'),
    create: (rule) => api.post('/alerts/rules', rule),
    update: (id, rule) => api.put(`/alerts/rules/${id}`, rule),
    delete: (id) => api.delete(`/alerts/rules/${id}`),
};

// Security API Services
export const securityAPI = {
    redactions: () => api.get('/security/redactions'),
};

export default api;
