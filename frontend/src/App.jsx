import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import IncidentsPage from './pages/IncidentsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertRulesPage from './pages/AlertRulesPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/alerts" element={<AlertRulesPage />} />
          </Route>
        </Route>

        {/* Catch all - Redirect to dashboard (which handles auth check) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
