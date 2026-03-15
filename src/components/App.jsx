import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { db, auth, firebase } from '../services/firebase';
import { Icons } from './Icons';
import { AnnouncementBar } from './AnnouncementBar';
import { ScrollProgress } from './ScrollProgress';
import { BackToTop } from './BackToTop';
import { NeuralNetwork } from './NeuralNetwork';
import { MatrixRain } from './MatrixRain';
import { TextScramble } from './TextScramble';
import { TiltCard } from './TiltCard';
import { ProjectModal } from './ProjectModal';
import { ImageModal } from './ImageModal';
import { CertificateCard } from './CertificateCard';
import { GroqChatbot } from './GroqChatbot';
import { BiographySection } from './BiographySection';
import { AdminPanel } from './AdminPanel';

const App = () => {
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showAllProjects, setShowAllProjects] = useState(false);
    
    const [certifications, setCertifications] = useState([]);
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    
    const [heroConfig, setHeroConfig] = useState({ headline: 'Mitanshu Bhasin', subtext: 'System Architect & Full Stack Developer.', status: 'ONLINE' });
    const [siteConfig, setSiteConfig] = useState({ phone: '', email: '', instagram: '', linkedin: '', groqApiKey: '', groqModel: '', avatarUrl: '' });
    const [announcement, setAnnouncement] = useState({ text: '', active: false });
    
    const [contactForm, setContactForm] = useState({ name: '', phone: '', inquiryType: 'Project', message: '' });
    const [contactStatus, setContactStatus] = useState('idle');

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
        }, { threshold: 0.1 });
        setTimeout(() => document.querySelectorAll('.reveal').forEach(el => observer.observe(el)), 100);
        return () => observer.disconnect();
    }, [theme, projects, certifications, loading, showAllProjects]);

    useEffect(() => {
        const unsubAuth = auth.onAuthStateChanged(setUser);
        
        const unsubHero = db.collection('site_config').doc('hero').onSnapshot(d => d.exists && setHeroConfig(d.data()));
        const unsubMain = db.collection('site_config').doc('main').onSnapshot(d => d.exists && setSiteConfig(prev => ({...prev, ...d.data()})));
        const unsubAnnounce = db.collection('site_config').doc('announcement').onSnapshot(d => d.exists && setAnnouncement(d.data()));
        
        const unsubCerts = db.collection('certifications').orderBy('createdAt', 'desc').onSnapshot(s => setCertifications(s.docs.map(d => ({id: d.id, ...d.data()}))));
        const unsubProjs = db.collection('projects').orderBy('createdAt', 'desc').onSnapshot(s => setProjects(s.docs.map(d => ({id: d.id, ...d.data()}))));
        
        return () => { unsubAuth(); unsubHero(); unsubMain(); unsubAnnounce(); unsubCerts(); unsubProjs(); };
    }, []);

    useEffect(() => {
        if (user) return db.collection('messages').orderBy('timestamp', 'desc').onSnapshot(s => setMessages(s.docs.map(d => ({id: d.id, ...d.data()}))));
    }, [user]);

    const sendMsg = async (e) => {
        e.preventDefault();
        setContactStatus('sending');
        try {
            await db.collection('messages').add({ ...contactForm, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
            setContactStatus('sent');
            setContactForm({ name: '', phone: '', inquiryType: 'Project', message: '' });
            setTimeout(() => setContactStatus('idle'), 3000);
        } catch (e) {
            alert(e.message);
            setContactStatus('error');
        }
    };

    const scrollTo = (id) => document.getElementById(id) && document.getElementById(id).scrollIntoView({ behavior: 'smooth' });

    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            const pA = a.priority || 0;
            const pB = b.priority || 0;
            if (pA !== pB) return pB - pA;
            return 0; 
        });
    }, [projects]);

    const displayedProjects = showAllProjects ? sortedProjects : sortedProjects.slice(0, 6);

    const sortedCerts = useMemo(() => {
        return [...certifications].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }, [certifications]);

    const skills = [
        { name: "Full Stack Dev", level: "98%" },
        { name: "Python & Scripting", level: "95%" },
        { name: "Ethical Hacking", level: "90%" },
        { name: "Linux & Servers", level: "92%" },
        { name: "System Architecture", level: "95%" }
    ];

    const servicesList = [
        { title: 'Web Development', desc: 'Building blazing fast, SEO-optimized websites using React & modern tech.', icon: <Icons.Globe size={32}/> },
        { title: 'App Development', desc: 'Cross-platform mobile apps that offer seamless user experiences.', icon: <Icons.Phone size={32}/> },
        { title: 'Ethical Hacking', desc: 'Securing your digital assets by finding vulnerabilities before hackers do.', icon: <Icons.Shield size={32}/> },
        { title: 'Server Management', desc: 'Linux based server setup, maintenance, and security hardening.', icon: <Icons.Server size={32}/> },
        { title: 'Python Automation', desc: 'Automating boring tasks and building complex backend logic with Python.', icon: <Icons.Cpu size={32}/> },
        { title: 'Consultation', desc: 'Expert advice on system architecture and tech stack selection.', icon: <Icons.Bot size={32}/> }
    ];

    if (loading) return (
        <>
            {theme === 'cyber' ? <MatrixRain color="#00ff41" /> : <NeuralNetwork />}
            <div id="preloader">
                <div className="text-xl md:text-3xl font-bold tracking-widest mb-6 font-heading glitch-text" data-text="MITANSHU BHASIN">MITANSHU BHASIN</div>
                <div className="w-64 h-1 bg-slate-800 rounded overflow-hidden mb-2">
                    <div className="h-full bg-blue-500 animate-[width_0.8s_ease-out] w-full origin-left"></div>
                </div>
                <div className="text-[10px] md:text-xs opacity-70 font-mono space-y-1 text-center">
                    <span className="block">{'>'} SYSTEM BOOT... FAST MODE</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
            <ScrollProgress />
            {theme === 'cyber' ? <MatrixRain color="#00ff41" /> : <NeuralNetwork />}
            <div className="scanlines"></div>

            <AnnouncementBar config={announcement} />

            {/* NAV */}
            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${theme === 'light' ? 'bg-white/70 border-b border-white/50' : 'bg-[#0f172a]/80 border-b border-slate-800/50'} backdrop-blur-md`}>
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className={`text-xl md:text-2xl font-bold tracking-wider cursor-pointer flex items-center gap-3 hover-trigger ${theme === 'cyber' ? 'font-heading glitch-text text-blue-500' : 'text-slate-900 font-sans'}`} data-text="MITANSHU" onClick={() => scrollTo('home')}>
                        {siteConfig.avatarUrl ? (
                            <img src={siteConfig.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-current shadow-lg hover:rotate-12 transition-transform" />
                        ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-current ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}><Icons.User size={20} /></div>
                        )}
                        <span className="hidden md:block"><TextScramble text="MITANSHU" /></span>
                    </div>
                    <div className="hidden md:flex gap-8 items-center text-sm font-medium">
                        {['About', 'Services', 'Projects', 'Certifications', 'Contact'].map(item => (
                            <button key={item} onClick={() => scrollTo(item.toLowerCase())} className={`transition-all hover:scale-105 hover-trigger uppercase tracking-wide text-xs font-bold ${theme === 'light' ? 'text-slate-600 hover:text-blue-600' : 'text-slate-400 hover:text-blue-500 hover:shadow-[0_0_10px_rgba(0,255,65,0.5)]'}`}>
                                {item}
                            </button>
                        ))}
                        <div className="w-px h-6 bg-gray-300/50 mx-2"></div>
                        <button onClick={toggleTheme} className={`p-2 rounded-full transition-all hover:rotate-45 hover-trigger ${theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-yellow-400 border border-yellow-400'}`}>
                            {theme === 'light' ? <Icons.Moon size={18} /> : <Icons.Sun size={18} />}
                        </button>
                        {user && <button onClick={() => setIsAdminPanelOpen(true)} className="text-red-500 font-bold border border-red-500 px-3 py-1 text-[10px] rounded animate-pulse">ADMIN</button>}
                    </div>
                    <button className="md:hidden hover-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}><Icons.Menu /></button>
                </div>
                {isMenuOpen && (
                    <div className={`md:hidden absolute w-full border-b p-4 flex flex-col gap-4 shadow-lg animate-float ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-[#0f172a] border-slate-800'}`}>
                        {['About', 'Services', 'Projects', 'Contact'].map(item => <button key={item} onClick={() => {scrollTo(item.toLowerCase()); setIsMenuOpen(false);}} className="text-left font-bold py-2">{item}</button>)}
                        <div className="flex justify-between items-center border-t pt-4 border-gray-700">
                            <span>System Mode</span>
                            <button onClick={toggleTheme}>{theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 relative">
                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
                    <div className="space-y-6">
                        <div className={`inline-block px-3 py-1 text-[10px] font-mono mb-2 rounded border reveal ${theme === 'light' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'border-blue-500 bg-[#0f172a]/50 text-blue-400'}`}>
                            SYSTEM_STATUS: <span className="animate-pulse">{heroConfig.status}</span>
                        </div>
                        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight reveal reveal-delay-1 ${theme === 'cyber' ? 'font-heading glitch-text text-white' : 'text-slate-900 font-sans tracking-tight'}`} data-text={heroConfig.headline}>
                            <TextScramble text={heroConfig.headline} />
                        </h1>
                        <p className={`text-lg md:text-xl max-w-lg reveal reveal-delay-2 ${theme === 'light' ? 'text-slate-600 font-light' : 'text-slate-400 font-mono'}`}>
                            {heroConfig.subtext}
                        </p>
                        <div className="flex gap-4 pt-4 reveal reveal-delay-3">
                            <button onClick={() => scrollTo('contact')} className={`font-bold py-3 px-8 transition-all hover:scale-105 hover-trigger ${theme === 'light' ? 'bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg hover:shadow-xl' : 'bg-blue-600 text-black hover:bg-blue-500 border border-blue-400 rounded-none'}`}>
                                Start Project
                            </button>
                            <button onClick={() => scrollTo('projects')} className={`font-bold py-3 px-8 transition-all hover:scale-105 hover-trigger ${theme === 'light' ? 'bg-white text-slate-900 border border-slate-200 hover:border-slate-400 rounded-full' : 'bg-transparent text-blue-500 border border-blue-500 hover:bg-slate-900/20 rounded-none'}`}>
                                View Work
                            </button>
                        </div>
                    </div>
                    <div className="perspective-1000 reveal reveal-delay-2">
                        <TiltCard className={`rounded-2xl p-8 shadow-2xl transition-all ${theme === 'light' ? 'bg-white/80 border border-gray-100 shadow-xl shadow-blue-500/10 backdrop-blur-xl' : 'bg-slate-900/80 border border-slate-700 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,65,0.1)]'}`}>
                            <div className="flex gap-2 mb-6 border-b border-gray-700/20 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors"></div>
                            </div>
                            <div className={`font-mono text-sm space-y-3 ${theme === 'light' ? 'text-slate-600' : 'text-blue-400'}`}>
                                <p><span className="text-purple-500">class</span> <span className="text-amber-600">Architect</span> <span className="text-purple-500">extends</span> <span className="text-amber-600">Developer</span> {'{'}</p>
                                <p className="pl-4">constructor() {'{'}</p>
                                <p className="pl-8">this.name = <span className="text-emerald-600">"Mitanshu"</span>;</p>
                                <p className="pl-8">this.vision = <span className="text-emerald-600">"Infinite Scalability"</span>;</p>
                                <p className="pl-8">this.stack = [<span className="text-emerald-600">"MERN"</span>, <span className="text-emerald-600">"Firebase"</span>, <span className="text-emerald-600">"Python"</span>];</p>
                                <p className="pl-4">{'}'}</p>
                                <p className="pl-4">buildFuture() {'{'}</p>
                                <p className="pl-8 text-blue-500 font-bold">// TODO: Change the world</p>
                                <p className="pl-8">return <span className="text-purple-500">new</span> Legacy();</p>
                                <p className="pl-4">{'}'}</p>
                                <p>{'}'}</p>
                                <p className="animate-pulse">_</p>
                            </div>
                        </TiltCard>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="py-24">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div className="reveal">
                        <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'cyber' ? 'font-heading border-l-4 border-purple-500 pl-4' : 'text-slate-900'}`}>The Architect's Mind</h2>
                        <div className={`leading-relaxed mb-6 space-y-4 text-lg ${theme === 'light' ? 'text-slate-600' : 'text-slate-400 font-mono'}`}>
                            <p>I don't just write code; I design <strong className={theme==='light'?'text-blue-600':'text-blue-400'}>digital ecosystems</strong>. At 16, balancing JEE advanced physics with enterprise-level system architecture has taught me one thing: <strong>Efficiency is King.</strong></p>
                            <p>My stack is built for speed and security. Whether it's securing a Linux server or deploying a serverless React app on Firebase, I bring military-grade discipline to software engineering.</p>
                        </div>
                        <div className="mt-8 space-y-5">
                            {skills.map((s, idx) => (
                                <div key={s.name} className={`reveal reveal-delay-${(idx%3)+1}`}>
                                    <div className="flex justify-between text-xs font-bold mb-1 opacity-80"><span>{s.name}</span><span>{s.level}</span></div>
                                    <div className={`h-2 w-full rounded-full overflow-hidden ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}>
                                        <div className={`h-full rounded-full skill-bar-fill ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`} style={{'--target-width': s.level}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`p-8 rounded-2xl reveal reveal-delay-2 ${theme === 'light' ? 'bg-white shadow-xl border border-slate-100' : 'bg-[#0f172a]/50 border border-slate-800 font-mono shadow-[0_0_20px_rgba(0,255,0,0.1)]'}`}>
                        <h3 className="font-bold mb-6 pb-2 border-b border-gray-700/20 text-xl">System Specs</h3>
                        <ul className="space-y-6 text-sm">
                            <li className="flex justify-between items-center group"><span className="opacity-70 group-hover:text-blue-500 transition-colors">Location</span> <span className="font-bold">Delhi, India</span></li>
                            <li className="flex justify-between items-center group"><span className="opacity-70 group-hover:text-blue-500 transition-colors">Role</span> <span className="font-bold">System Architect</span></li>
                            <li className="flex justify-between items-center group"><span className="opacity-70 group-hover:text-blue-500 transition-colors">Education</span> <span className="font-bold">Class 11 (JEE - PCM+CS)</span></li>
                            <li className="flex justify-between items-center group">
                                <span className="opacity-70 group-hover:text-blue-500 transition-colors">Core Stack</span> 
                                <span className={`font-bold text-xs px-2 py-1 rounded transition-colors ${theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-slate-900 text-cyan-300'}`}>
                                    React, Node, Firebase
                                </span>
                            </li>
                            <li className="flex justify-between items-center group"><span className="opacity-70 group-hover:text-blue-500 transition-colors">Status</span> <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${theme === 'light' ? 'bg-green-100 text-slate-400' : 'bg-slate-900 text-blue-400 animate-pulse'}`}>OPEN FOR WORK</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section id="services" className={`py-24 ${theme === 'light' ? 'bg-slate-50' : ''}`}>
                <div className="container mx-auto px-4">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-16 text-center reveal ${theme === 'cyber' ? 'font-heading text-white' : 'text-slate-900'}`}>Services Deployed</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {servicesList.map((svc, i) => (
                            <div key={i} className={`p-8 transition-all duration-300 hover:-translate-y-3 group flex flex-col items-center text-center reveal reveal-delay-${(i%3)+1} hover-trigger ${theme === 'light' ? 'bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-slate-100' : 'bg-slate-900/40 border border-slate-800 hover:border-blue-500'}`}>
                                <div className={`mb-6 p-4 rounded-2xl inline-block transition-transform group-hover:scale-110 group-hover:rotate-3 ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-slate-900/20 text-blue-500'}`}>
                                    {svc.icon}
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{svc.title}</h3>
                                <p className="text-sm opacity-70 leading-relaxed">{svc.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROJECTS */}
            <section id="projects" className="py-24">
                <div className="container mx-auto px-4">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-16 text-center reveal ${theme === 'cyber' ? 'font-heading text-white' : 'text-slate-900'}`}>Featured Deployments</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedProjects.map((proj, idx) => (
                            <div onClick={() => setSelectedProject(proj)} key={proj.id} className={`cursor-pointer flex flex-col h-full transition-all duration-500 hover:-translate-y-2 group reveal reveal-delay-${(idx%3)+1} hover-trigger relative overflow-hidden ${theme === 'light' ? 'bg-white rounded-2xl shadow-md hover:shadow-2xl border border-slate-100' : 'bg-slate-900/30 border border-gray-800 hover:border-blue-500'}`}>
                                <div className="absolute top-0 right-0 z-10 flex flex-col items-end gap-1 p-2">
                                    {(() => {
                                        const badges = [];
                                        if (proj.isComplex) badges.push(
                                            <div key="complex" className={`text-[10px] font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1 backdrop-blur-md ${theme === 'light' ? 'bg-yellow-400 text-black' : 'bg-yellow-600/90 text-white border border-yellow-400'}`}>
                                                <Icons.Star size={12} fill="currentColor" /> FLAGSHIP
                                            </div>
                                        );
                                        if (proj.isMedium) badges.push(
                                            <div key="medium" className={`text-[10px] font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1 backdrop-blur-md ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-600/90 text-white border border-blue-400'}`}>
                                                <Icons.Zap size={12} fill="currentColor" /> CORE
                                            </div>
                                        );
                                        if (proj.isTool) badges.push(
                                            <div key="tool" className={`text-[10px] font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1 backdrop-blur-md ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-600/90 text-white border border-blue-400'}`}>
                                                <Icons.Wrench size={12} fill="currentColor" /> TOOL
                                            </div>
                                        );
                                        return badges.slice(0, 2);
                                    })()}
                                </div>

                                <div className="p-8 flex-1 mt-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className={`text-xl font-bold group-hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-slate-800' : 'text-white font-heading group-hover:text-blue-400'}`}>{proj.title}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {proj.tags && proj.tags.map((t,i) => (
                                            <span key={i} className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border ${theme === 'light' ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-[#0f172a] text-blue-400 border-slate-800 group-hover:border-blue-500/50'}`}>{t}</span>
                                        ))}
                                    </div>
                                    <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>{proj.desc}</p>
                                </div>
                                <div className={`flex justify-between items-center px-8 py-4 text-xs font-bold tracking-wider transition-colors hover-trigger ${theme === 'light' ? 'bg-slate-50 border-t border-slate-100 text-slate-500 group-hover:bg-slate-100 group-hover:text-blue-600' : 'bg-slate-900/10 border-t border-gray-800 text-gray-500 group-hover:bg-slate-900/30 group-hover:text-blue-400'}`}>
                                    <span>ACCESS TERMINAL</span>
                                    <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {projects.length > 6 && (
                        <div className="mt-12 text-center reveal">
                            <button 
                                onClick={() => setShowAllProjects(!showAllProjects)} 
                                className={`px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all hover:scale-105 shadow-lg ${theme === 'light' ? 'bg-slate-900 text-white hover:bg-slate-700' : 'bg-slate-900/20 border border-blue-500 text-blue-500 hover:bg-slate-900/50'}`}
                            >
                                {showAllProjects ? "Collapse List" : "View All Deployments"}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CERTIFICATIONS */}
            <section id="certifications" className={`py-24 ${theme === 'light' ? 'bg-slate-50' : ''}`}>
                <div className="container mx-auto px-4">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-16 text-center reveal ${theme === 'cyber' ? 'font-heading text-white' : 'text-slate-900'}`}>Credentials</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedCerts.map(cert => (
                            <CertificateCard 
                                key={cert.id} 
                                cert={cert} 
                                theme={theme} 
                                onImageClick={(src, title) => setSelectedImage({src, title})} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            <BiographySection theme={theme} />

            {/* CONTACT */}
            <section id="contact" className={`py-24 relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-black to-green-900/20'}`}>
                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-6 reveal ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Establish Connection</h2>
                    <p className="text-gray-500 mb-12 reveal reveal-delay-1">Have a project in mind? Let's build something that breaks the internet.</p>
                    
                    <div className={`p-8 md:p-12 text-left rounded-2xl shadow-2xl transition-all reveal reveal-delay-2 ${theme === 'light' ? 'bg-white border border-slate-100 shadow-xl' : 'bg-slate-900/80 border border-blue-500 backdrop-blur-md'}`}>
                        {contactStatus === 'sent' ? (
                            <div className="text-center py-10 animate-float">
                                <div className="mb-4 inline-flex p-4 rounded-full bg-green-100 text-blue-600"><Icons.Bot size={40} /></div>
                                <h3 className="text-2xl font-bold text-blue-600 mb-2">Transmission Received!</h3>
                                <p className="text-gray-500">Stand by for response.</p>
                            </div>
                        ) : (
                            <form onSubmit={sendMsg} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-bold uppercase tracking-wider opacity-70 group-focus-within:text-blue-500 transition-colors">Name / Alias</label>
                                        <input required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} className={`w-full p-4 rounded-xl outline-none border transition-all hover-trigger ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10' : 'bg-[#0f172a] border-slate-800 text-white focus:border-blue-500 focus:shadow-[0_0_15px_rgba(0,255,0,0.2)]'}`} />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-xs font-bold uppercase tracking-wider opacity-70 group-focus-within:text-blue-500 transition-colors">Comm Link (Phone/Email)</label>
                                        <input required value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} className={`w-full p-4 rounded-xl outline-none border transition-all hover-trigger ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10' : 'bg-[#0f172a] border-slate-800 text-white focus:border-blue-500 focus:shadow-[0_0_15px_rgba(0,255,0,0.2)]'}`} />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold uppercase tracking-wider opacity-70 group-focus-within:text-blue-500 transition-colors">Protocol (Inquiry Type)</label>
                                    <select 
                                        value={contactForm.inquiryType} 
                                        onChange={e => setContactForm({...contactForm, inquiryType: e.target.value})} 
                                        className={`w-full p-4 rounded-xl outline-none border transition-all cursor-pointer hover-trigger ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-800' : 'bg-[#0f172a] border-slate-800 text-white focus:border-blue-500'}`}
                                    >
                                        <option value="Project">I want to build a Project (Project)</option>
                                        <option value="Quote">I need a Quote (Price Estimate)</option>
                                        <option value="Hiring">Hiring / Job Offer</option>
                                        <option value="Collaboration">Collaboration / Partnership</option>
                                        <option value="Other">Other Query</option>
                                    </select>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold uppercase tracking-wider opacity-70 group-focus-within:text-blue-500 transition-colors">Payload (Message)</label>
                                    <textarea required rows="4" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} className={`w-full p-4 rounded-xl outline-none border transition-all hover-trigger ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10' : 'bg-[#0f172a] border-slate-800 text-white focus:border-blue-500 focus:shadow-[0_0_15px_rgba(0,255,0,0.2)]'}`} placeholder="Describe mission parameters..."></textarea>
                                </div>
                                <button type="submit" disabled={contactStatus === 'sending'} className={`w-full py-4 font-bold tracking-widest uppercase transition-all rounded-xl hover-trigger transform active:scale-95 ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-600 hover:bg-blue-500 text-black border border-blue-400 hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]'}`}>
                                    {contactStatus === 'sending' ? 'Transmitting...' : 'Send Transmission'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className={`py-12 text-center text-xs transition-colors relative z-10 ${theme === 'light' ? 'bg-slate-100 text-slate-500 border-t border-slate-200' : 'bg-[#0f172a] border-t border-slate-800 text-green-700'}`}>
                <div className="container mx-auto px-4">
                    <p className="font-semibold text-sm">&copy; {new Date().getFullYear()} Mitanshu Bhasin.</p>
                    <p className="mt-2 opacity-60">System Architect // Full Stack Developer // Cyber Defender</p>
                    <div className="mt-6 flex justify-center">
                        <button onClick={() => setIsAdminPanelOpen(true)} className="opacity-20 hover:opacity-80 transition-opacity text-xs flex items-center gap-1 cursor-default hover-trigger">
                            <Icons.Lock size={12}/> Secure Access
                        </button>
                    </div>
                </div>
            </footer>
            
            {/* SOCIALS */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
                 {siteConfig.phone && (
                    <a href={`tel:${siteConfig.phone}`} className="p-4 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform flex items-center justify-center hover-trigger">
                        <Icons.Phone size={20}/>
                    </a>
                 )}
                 <a href="https://instagram.com/mitanshubhasin" target="_blank" rel="noopener noreferrer" className="p-4 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center hover-trigger" style={{background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'}}>
                     <Icons.Instagram size={20}/>
                 </a>
                 {siteConfig.linkedin && (
                    <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-blue-700 text-white rounded-full shadow-lg shadow-blue-700/40 hover:scale-110 transition-transform flex items-center justify-center hover-trigger">
                        <Icons.Linkedin size={20}/>
                    </a>
                 )}
                 {siteConfig.phone && (
                    <a href={`https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-blue-500 text-white rounded-full shadow-lg shadow-green-500/40 hover:scale-110 transition-transform flex items-center justify-center hover-trigger">
                        <Icons.MessageCircle size={20}/>
                    </a>
                 )}
            </div>

            <BackToTop theme={theme} />
            <GroqChatbot apiKey={siteConfig.groqApiKey} model={siteConfig.groqModel} isOpen={isChatOpen} setIsOpen={setIsChatOpen} theme={theme} />

            <ImageModal src={selectedImage && selectedImage.src} title={selectedImage && selectedImage.title} onClose={() => setSelectedImage(null)} />
            <ProjectModal project={selectedProject} theme={theme} onClose={() => setSelectedProject(null)} />

            <AdminPanel
                isOpen={isAdminPanelOpen}
                setIsOpen={setIsAdminPanelOpen}
                user={user}
                theme={theme}
                projects={projects}
                certifications={certifications}
                messages={messages}
                heroConfig={heroConfig}
                setHeroConfig={setHeroConfig}
                siteConfig={siteConfig}
                setSiteConfig={setSiteConfig}
                announcement={announcement}
                setAnnouncement={setAnnouncement}
            />
        </div>
    );
};

export default App;
