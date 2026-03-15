import React from 'react';
import { Icons } from './Icons';

export const BiographySection = ({ theme }) => {
    return (
        <section id="biography" className={`py-24 ${theme === 'light' ? 'bg-white' : 'bg-[#0f172a]/80'}`}>
            <div className="container mx-auto px-4">
                 <a href="story.html" target="_blank" rel="noopener noreferrer" className={`block group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 reveal ${theme === 'light' ? 'bg-white shadow-2xl border border-slate-100' : 'bg-slate-900 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]'}`}>
                    <div className="grid md:grid-cols-2">
                        {/* Image */}
                        <div className="relative h-64 md:h-auto overflow-hidden">
                             <div className={`absolute inset-0 z-10 ${theme === 'light' ? 'bg-gradient-to-t from-white/20' : 'bg-gradient-to-t from-black/80'} via-transparent`}></div>
                             <img src="mitanshu.jpg" className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Origins" />
                        </div>
                        {/* Content */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <span className={`inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase rounded border w-fit mb-4 ${theme === 'light' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-900/30 text-blue-400 border-blue-500 animate-pulse'}`}>Origins</span>
                             <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight ${theme === 'light' ? 'text-slate-900' : 'text-white font-heading glitch-text'}`} data-text="THE UNTOLD STORY">THE UNTOLD STORY</h2>
                             <p className={`text-lg mb-8 leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400 font-mono'}`}>From facing attacks to building digital empires. Explore the real Mitanshu Bhasin beyond the certifications.</p>
                             <div className={`inline-flex items-center gap-2 font-bold tracking-widest text-sm uppercase ${theme === 'light' ? 'text-blue-600 group-hover:gap-4 transition-all' : 'text-blue-400 group-hover:text-cyan-300'}`}>
                                READ ARTICLE <Icons.ArrowUp className="rotate-45" size={16}/>
                             </div>
                        </div>
                    </div>
                 </a>
            </div>
        </section>
    );
};
