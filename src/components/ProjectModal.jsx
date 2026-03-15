import React from 'react';
import { Icons } from './Icons';

export const ProjectModal = ({ project, onClose, theme }) => {
    if (!project) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-zoom" onClick={onClose}>
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative flex flex-col md:flex-row ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-blue-400 border border-blue-500'}`} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors"><Icons.X /></button>
                
                {/* Fake PDF Sidebar */}
                <div className={`hidden md:flex flex-col w-1/4 p-6 border-r ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#0f172a] border-slate-700'}`}>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Document Info</div>
                    <div className="space-y-4 text-sm">
                        <div>
                            <div className="opacity-70 text-xs">Project Name</div>
                            <div className="font-bold">{project.title}</div>
                        </div>
                        <div>
                            <div className="opacity-70 text-xs">Date</div>
                            <div className="font-mono">{project.createdAt ? new Date(project.createdAt.seconds * 1000).toLocaleDateString() : 'Classified'}</div>
                        </div>
                        {project.isComplex && (
                            <div className="p-2 bg-yellow-500/10 border border-yellow-500 rounded text-yellow-600 text-xs font-bold text-center">
                                ⭐ FLAGSHIP SYSTEM
                            </div>
                        )}
                        <div>
                            <div className="opacity-70 text-xs">Tech Stack</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {project.tags && project.tags.map((t,i) => (
                                    <span key={i} className="text-[10px] border px-1 rounded opacity-70">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <div className="mb-8 pb-4 border-b border-dashed border-current opacity-30 flex justify-between items-end">
                        <h1 className="text-3xl font-bold font-heading">{project.title}</h1>
                        <div className="text-xs font-mono opacity-70">CONFIDENTIAL // PROJECT FILE</div>
                    </div>
                    
                    <div className="prose max-w-none mb-8 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base">
                        {project.desc}
                    </div>

                    {project.link && (
                        <div className="mt-8 pt-6 border-t border-current opacity-80">
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-black hover:bg-blue-500'}`}>
                                <Icons.Link size={18}/> LAUNCH DEPLOYMENT
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
