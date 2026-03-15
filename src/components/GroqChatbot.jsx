import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { useChatPersistence } from '../hooks/useChatPersistence';

export const GroqChatbot = ({ apiKey, model, isOpen, setIsOpen, theme }) => {
    const [messages, setMessages, clearHistory] = useChatPersistence();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current && chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        if (!apiKey) {
            setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Missing API Key.' }]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg].filter(m => m.role !== 'system'), model: model || "llama3-8b-8192" })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            setMessages(prev => [...prev, data.choices[0].message]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="fixed bottom-6 left-6 z-50 group flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
                <div className={`relative p-4 rounded-full shadow-2xl transition-all duration-500 ${theme === 'light' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/40 hover:shadow-blue-600/60 ring-2 ring-white/50' : 'bg-[#0f172a] text-blue-400 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]'}`}>
                    <Icons.Bot size={32} className="relative z-10" />
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${theme === 'light' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                    <div className={`absolute -inset-1 rounded-full animate-pulse opacity-40 blur-sm ${theme === 'light' ? 'bg-indigo-400' : 'bg-blue-600'}`}></div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-extrabold tracking-[0.2em] uppercase backdrop-blur-xl border transition-colors ${theme === 'light' ? 'bg-white/90 text-blue-900 border-blue-200 shadow-sm' : 'bg-[#0f172a]/80 text-blue-400 border-slate-700 shadow-lg'}`}>
                    AI_CORE
                </div>
            </button>

            {isOpen && (
                <div className={`fixed bottom-40 left-6 z-50 w-80 md:w-96 rounded-lg overflow-hidden flex flex-col h-96 shadow-2xl glass-panel animate-float ${theme === 'light' ? 'border-gray-200' : 'border-blue-500'}`}>
                    <div className={`p-3 border-b flex justify-between items-center ${theme === 'light' ? 'bg-gray-100/50 text-gray-800' : 'bg-slate-900/20 text-blue-500 font-cyber'}`}>
                        <span className="text-sm font-bold flex items-center gap-2">ARCHITECT_AI</span>
                        <div className="flex items-center gap-2">
                            <button onClick={clearHistory} className="text-[10px] opacity-50 hover:opacity-100 transition-opacity" title="Clear history">
                                <Icons.Trash size={12}/>
                            </button>
                            <button onClick={() => setIsOpen(false)}><Icons.X size={16}/></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                        {messages.slice(1).map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-lg ${m.role === 'user' ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white') : (theme === 'light' ? 'bg-white shadow-sm text-gray-800' : 'bg-[#0f172a]/50 text-blue-400 border border-slate-800')}`}>{m.content}</div>
                            </div>
                        ))}
                        {isLoading && <div className="text-xs opacity-50 px-2 animate-pulse">Computing...</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className={`p-3 border-t flex gap-2 ${theme === 'light' ? 'bg-white/50' : 'bg-[#0f172a]/50 border-slate-800'}`}>
                        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Command..." className={`flex-1 p-2 text-xs outline-none rounded border ${theme === 'light' ? 'bg-white border-gray-200 text-black' : 'bg-[#0f172a] border-slate-800 text-white'}`} />
                        <button type="submit" className={theme === 'light' ? 'text-blue-600' : 'text-blue-500'}><Icons.Terminal size={16}/></button>
                    </form>
                </div>
            )}
        </>
    );
};
