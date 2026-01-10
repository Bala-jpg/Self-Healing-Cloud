import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './common/Sidebar';
import Header from './common/Header';
import ErrorBoundary from './common/ErrorBoundary';
import SecuritySidebar from './panels/SecuritySidebar';
import AIChatWidget from './chat/AIChatWidget';
import ToastProvider from './common/ToastProvider';

const Layout = () => {
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);

    return (
        <ToastProvider>
            <div className="flex h-screen bg-obsidian overflow-hidden">
                {/* Fixed Sidebar */}
                <Sidebar />

                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header with Security Toggle */}
                    <Header onSecurityClick={() => setIsSecurityOpen(!isSecurityOpen)} />

                    {/* Main Scrollable Content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-obsidian p-6 relative">
                        <div className="container mx-auto max-w-7xl">
                            <ErrorBoundary>
                                <Outlet />
                            </ErrorBoundary>
                        </div>
                    </main>

                    {/* Security Sidebar (Global Overlay) */}
                    <SecuritySidebar isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />

                    {/* AI Chat Widget */}
                    <AIChatWidget />
                </div>
            </div>
        </ToastProvider>
    );
};

export default Layout;
