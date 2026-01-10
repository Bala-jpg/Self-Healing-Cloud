/**
 * User Interface
 */
export interface User {
    id: string;
    name: string;
    email: string;
    project_id: string;
    role: 'admin' | 'viewer' | 'editor';
}

/**
 * Metric Data Point
 */
export interface MetricPoint {
    date: string; // ISO Date or formatted string
    value: number;
}

/**
 * Incident Entity
 */
export interface Incident {
    id: string;
    group_id: string;
    name: string;
    summary: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
    created_at: string;
    updated_at: string;
    services_affected: string[];
}

/**
 * Error Group Entity (RCA Group)
 */
export interface ErrorGroup {
    id: string;
    name: string;
    summary: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'RESOLVED' | 'IGNORED';
    first_seen: string;
    last_seen: string;
    count: number;
    root_cause?: RootCauseAnalysis;
}

/**
 * Root Cause Analysis Result
 */
export interface RootCauseAnalysis {
    cause: string;
    confidence: number; // 0.0 to 1.0
    evidence: string[]; // Log snippets or trace IDs
    analysis_job_id: string;
}

/**
 * Alert Rule Configuration
 */
export interface AlertRule {
    id: string;
    name: string;
    description?: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    threshold: number;
    window_minutes: number;
    enabled: boolean;
    notification_channels: string[]; // e.g., ['slack', 'email']
}

/**
 * Analysis Job Status
 */
export interface AnalysisJob {
    id: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    progress: number; // 0 to 100
    result_summary?: string;
    started_at: string;
    completed_at?: string;
}
