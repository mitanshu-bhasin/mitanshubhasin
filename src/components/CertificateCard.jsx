import React, { useState } from 'react';
import { Icons } from './Icons';

export const CertificateCard = ({ cert, theme, onImageClick }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className={`group relative overflow-hidden flex flex-col reveal hover-trigger ${theme === 'light' ? 'bg-white rounded-xl shadow-sm hover:shadow-2xl border border-slate-100' : 'bg-[#0f172a] border border-slate-800'} transition-all duration-500 hover:-translate-y-2`}>
            
            {/* Priority Badge */}
            {cert.priority > 80 && (
                <div className="absolute top-2 right-2 z-20">
                    <span className="bg-yellow-500 text-black text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Icons.Star size={10} fill="black" /> ELITE
                    </span>
                </div>
            )}

            <div 
                className={`h-48 w-full overflow-hidden relative flex justify-center items-center cursor-zoom-in ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-900'}`}
                onClick={() => onImageClick(cert.imageLink, cert.title)}
            >
                {cert.imageLink && !imgError ? (
                    <img src={cert.imageLink} alt={cert.title} onError={() => setImgError(true)} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className={`flex flex-col items-center justify-center text-center p-4 ${theme === 'light' ? 'text-slate-400' : 'text-slate-400'}`}>
                        <Icons.Image size={32} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-mono tracking-wider uppercase">No Visual</span>
                    </div>
                )}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${theme === 'light' ? 'bg-[#0f172a]/20' : 'bg-blue-500/10'}`}>
                    <span className="px-3 py-1 bg-[#0f172a]/70 text-white text-xs rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity delay-100">View Certificate</span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-1 leading-tight ${theme === 'light' ? 'text-slate-800' : 'text-white font-heading'}`}>{cert.title}</h3>
                    <p className="text-xs font-semibold text-blue-500 mb-2">{cert.issuer}</p>
                    
                    {/* Cert Tags */}
                    {cert.tags && cert.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {cert.tags.map((t, i) => (
                                <span key={i} className={`text-[9px] px-2 py-0.5 rounded border opacity-70 ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/30 border-slate-700 text-cyan-300'}`}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {cert.link && cert.link.trim() !== "" && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all w-fit hover-trigger ${theme === 'light' ? 'bg-slate-900 text-white hover:bg-blue-600' : 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-black'}`}>
                        <Icons.Link size={14}/> Verify
                    </a>
                )}
            </div>
        </div>
    );
};
