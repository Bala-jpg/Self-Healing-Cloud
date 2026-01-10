import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../common/ToastProvider';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'agent', text: 'Hello! I\'m your Reliability Agent. Ask me anything about system health or incidents.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { addToast } = useToast();

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Keyboard shortcut Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => {
                    const next = !prev;
                    if (next) setTimeout(() => inputRef.current?.focus(), 100);
                    return next;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI Thinking
        setTimeout(() => {
            let replyText = "I'm analyzing the telemetry data...";
            let type = 'info';

            // Simple keyword logic for demo
            const lowerInput = userMsg.text.toLowerCase();
            if (lowerInput.includes('failed') || lowerInput.includes('fail')) {
                replyText = "I've detected multiple timeouts in `payment-api`. I can fetch the logs for you.";
            } else if (lowerInput.includes('why')) {
                replyText = "Correlation analysis suggests a recent config change in `auth-service` is causing downstream latency.";
            } else if (lowerInput.includes('heal') || lowerInput.includes('fix')) {
                replyText = "I can attempt to rollback `payment-api` to v2.3. Would you like me to proceed?";
                // Trigger a toast for effect
                setTimeout(() => addToast('Simulating: Rollback initiated for payment-api', 'warning'), 1000);
            } else if (lowerInput.includes('status')) {
                replyText = "System is running at 99.98% uptime. 0 active critical alerts.";
                type = 'success';
            }

            const agentMsg = { id: Date.now() + 1, sender: 'agent', text: replyText };
            setMessages(prev => [...prev, agentMsg]);
            setIsTyping(false);

            if (type === 'success') addToast('AI Analysis Complete', 'success');

        }, 1500);
    };

    return (
        <>
            {/* FAB Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 lg:right-10 w-14 h-14 bg-electric-blue rounded-full shadow-[0_0_20px_rgba(0,209,255,0.4)] flex items-center justify-center z-50 text-white transition-transform hover:scale-110 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                title="Ask AI Agent (Cmd+K)"
            >
                <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 lg:right-10 w-96 h-[500px] bg-obsidian border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-up bg-white/10 backdrop-blur-xl">
                    {/* Header */}
                    <div className="h-14 bg-black/40 border-b border-white/10 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success-green animate-pulse"></div>
                            <span className="font-bold text-gray-100">AI Reliability Agent</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transform transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user'
                                        ? 'bg-electric-blue text-black font-medium rounded-tr-none'
                                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-black/40 border-t border-white/10">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full bg-black/50 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-sm text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none placeholder-gray-500"
                                placeholder="Ask about system status..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="absolute right-1 top-1 p-1.5 bg-electric-blue rounded-full text-black hover:bg-white disabled:opacity-50 transition-colors"
                            >
                                <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-[10px] text-gray-600 text-center mt-2 font-mono">
                            Press ⌘K to open • AI can take autonomous actions
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIChatWidget;
