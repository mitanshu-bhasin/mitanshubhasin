import { useState, useEffect } from 'react';

const STORAGE_KEY = 'portfolio-chat-history';

const defaultMessages = [
    { role: 'system', content: 'You are the digital assistant of Mitanshu Bhasin. You are helpful, professional but can be witty.' },
    { role: 'assistant', content: 'System Online. How can I assist?' }
];

/**
 * Custom hook to persist GroqChatbot messages in localStorage.
 * Returns [messages, setMessages, clearHistory].
 */
export const useChatPersistence = () => {
    const [messages, setMessages] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch {
            // localStorage unavailable or corrupted
        }
        return defaultMessages;
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch {
            // localStorage unavailable
        }
    }, [messages]);

    const clearHistory = () => {
        setMessages(defaultMessages);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // localStorage unavailable
        }
    };

    return [messages, setMessages, clearHistory];
};
