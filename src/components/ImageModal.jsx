import React from 'react';
import { Icons } from './Icons';

export const ImageModal = ({ src, title, onClose }) => {
    if (!src) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/95 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out animate-zoom" onClick={onClose}>
            <button className="absolute top-6 right-6 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 transition-transform hover:scale-110 z-50">
                <Icons.X size={24}/>
            </button>
            <img src={src} alt={title} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-[#0f172a]/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm border border-gray-700 font-mono">
                {title}
            </div>
        </div>
    );
};
