import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

export const BackToTop = ({ theme }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (!visible) return null;
    return (
        <button 
            onClick={scrollToTop} 
            className={`fixed bottom-24 right-6 z-40 p-3 rounded-full shadow-lg transition-all hover:scale-110 hover:-translate-y-1 animate-zoom ${theme === 'light' ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-blue-600 text-black border border-blue-400'}`}
        >
            <Icons.ArrowUp size={20} />
        </button>
    );
};
