import React from 'react';
import { Icons } from './Icons';

export const AnnouncementBar = ({ config }) => {
    if (!config || !config.active || !config.text) return null;
    return (
        <div className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[35] animate-slideDown pointer-events-none">
             <div className="bg-yellow-400 text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-center gap-3 font-bold text-xs md:text-sm tracking-widest border-2 border-yellow-500 backdrop-blur-xl">
                <Icons.Megaphone size={16} className="animate-bounce" />
                <span className="uppercase">{config.text}</span>
             </div>
        </div>
    );
};
