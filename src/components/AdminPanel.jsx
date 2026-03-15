import React, { useState } from 'react';
import { Icons } from './Icons';
import { db, auth, firebase } from '../services/firebase';

export const AdminPanel = ({
    isOpen,
    setIsOpen,
    user,
    theme,
    projects,
    certifications,
    messages,
    heroConfig,
    setHeroConfig,
    siteConfig,
    setSiteConfig,
    announcement,
    setAnnouncement
}) => {
    const [adminTab, setAdminTab] = useState('config');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newCert, setNewCert] = useState({ title: '', issuer: '', link: '', imageLink: '', priority: 0, tags: '' });
    const [newProject, setNewProject] = useState({ title: '', desc: '', tags: '', link: '', priority: 0, isComplex: false, isMedium: false, isTool: false });
    const [editingProject, setEditingProject] = useState(null);
    const [editingCert, setEditingCert] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try { await auth.signInWithEmailAndPassword(email, password); setIsOpen(false); } catch(e) { alert(e.message); }
    };
    const handleLogout = () => { auth.signOut(); setIsOpen(false); };

    const saveCert = async (e) => { 
        e.preventDefault(); 
        const tagsArray = typeof newCert.tags === 'string' ? newCert.tags.split(',').map(t => t.trim()).filter(Boolean) : newCert.tags;
        const certData = { ...newCert, tags: tagsArray, priority: parseInt(newCert.priority) || 0 };
        if (editingCert) {
            await db.collection('certifications').doc(editingCert).update(certData);
        } else {
            await db.collection('certifications').add({ ...certData, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); 
        }
        setNewCert({ title: '', issuer: '', link: '', imageLink: '', priority: 0, tags: '' }); 
        setEditingCert(null); 
    };

    const startEditCert = (cert) => { 
        setNewCert({ title: cert.title, issuer: cert.issuer, link: cert.link || '', imageLink: cert.imageLink || '', priority: cert.priority || 0, tags: cert.tags ? cert.tags.join(', ') : '' }); 
        setEditingCert(cert.id); 
    };

    const deleteDoc = (coll, id) => { if (confirm("Delete?")) db.collection(coll).doc(id).delete(); };

    const saveProject = async (e) => { 
        e.preventDefault(); 
        const tags = typeof newProject.tags === 'string' ? newProject.tags.split(',').map(t => t.trim()) : newProject.tags; 
        const projectData = { ...newProject, tags, priority: parseInt(newProject.priority) || 0, isComplex: newProject.isComplex || false, isMedium: newProject.isMedium || false, isTool: newProject.isTool || false };
        if (editingProject) {
            await db.collection('projects').doc(editingProject).update(projectData);
        } else {
            await db.collection('projects').add({ ...projectData, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); 
        }
        setNewProject({ title: '', desc: '', tags: '', link: '', priority: 0, isComplex: false, isMedium: false, isTool: false }); 
        setEditingProject(null); 
    };

    const startEditProject = (proj) => { 
        setNewProject({ title: proj.title, desc: proj.desc, link: proj.link || '', tags: proj.tags ? proj.tags.join(', ') : '', priority: proj.priority || 0, isComplex: proj.isComplex || false, isMedium: proj.isMedium || false, isTool: proj.isTool || false }); 
        setEditingProject(proj.id); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#0f172a]/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-float">
            <div className="bg-slate-900 w-full max-w-4xl h-[85vh] flex flex-col border border-red-900 shadow-[0_0_50px_rgba(255,0,0,0.2)] rounded-xl overflow-hidden">
                <div className="bg-red-900/20 p-4 border-b border-red-900 flex justify-between items-center">
                    <h2 className="text-red-500 font-bold tracking-widest flex items-center gap-2 text-lg"><Icons.Shield size={20}/> GOD_MODE_ENABLED</h2>
                    <div className="flex items-center gap-4">
                        {user && <button onClick={handleLogout} className="text-xs text-red-300 hover:text-white underline hover-trigger">TERMINATE SESSION</button>}
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 hover-trigger"><Icons.X /></button>
                    </div>
                </div>
                {!user ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                        <Icons.Lock size={64} className="text-red-900 opacity-50 mb-4" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Identity" className="w-full max-w-sm bg-[#0f172a] border border-red-900 p-4 text-red-500 outline-none rounded-lg focus:border-red-500 transition-colors"/>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passcode" className="w-full max-w-sm bg-[#0f172a] border border-red-900 p-4 text-red-500 outline-none rounded-lg focus:border-red-500 transition-colors"/>
                        <button onClick={handleLogin} className="w-full max-w-sm bg-red-900 text-white font-bold py-4 rounded-lg hover:bg-red-800 transition-colors hover-trigger">AUTHENTICATE</button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex border-b border-red-900 bg-[#0f172a]">
                            {['config', 'projects', 'certs', 'inbox'].map(t => (
                                <button key={t} onClick={() => setAdminTab(t)} className={`flex-1 py-4 uppercase text-xs font-bold transition-colors hover-trigger ${adminTab === t ? 'bg-red-900 text-white' : 'text-gray-500 hover:bg-slate-800'}`}>{t}</button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-900 text-gray-300">
                            {adminTab === 'config' && (
                                <div className="space-y-6 max-w-2xl mx-auto">
                                    <div className="bg-[#0f172a]/50 p-4 border border-red-900/50 rounded-lg">
                                        <div className="text-xs uppercase font-bold text-red-400 mb-2">Global Broadcast (Top Bar)</div>
                                        <div className="flex gap-2 mb-2">
                                            <input value={announcement.text} onChange={e => setAnnouncement({...announcement, text: e.target.value})} placeholder="Announcement Text" className="flex-1 bg-[#0f172a] border border-red-900 p-2 text-white text-xs rounded"/>
                                            <button onClick={() => setAnnouncement({...announcement, active: !announcement.active})} className={`px-3 text-xs font-bold rounded ${announcement.active ? 'bg-blue-600 text-black' : 'bg-gray-700 text-slate-400'}`}>{announcement.active ? 'ON' : 'OFF'}</button>
                                        </div>
                                        <button onClick={() => db.collection('site_config').doc('announcement').set(announcement, {merge:true})} className="w-full bg-red-900/50 hover:bg-red-900 text-white py-1 rounded text-xs">UPDATE BROADCAST</button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-red-400">Hero Headline</label>
                                        <input value={heroConfig.headline} onChange={e => setHeroConfig({...heroConfig, headline: e.target.value})} className="w-full bg-[#0f172a] border border-red-900 p-3 text-white rounded"/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-red-400">Status</label>
                                        <input value={heroConfig.status} onChange={e => setHeroConfig({...heroConfig, status: e.target.value})} className="w-full bg-[#0f172a] border border-red-900 p-3 text-white rounded"/>
                                    </div>
                                    <button onClick={() => db.collection('site_config').doc('hero').set(heroConfig, {merge:true})} className="bg-red-700 text-white px-6 py-2 rounded text-xs font-bold hover:bg-red-600 transition-colors">SAVE HERO</button>
                                    <div className="h-px bg-red-900/50 my-6"></div>
                                    <div className="grid gap-4">
                                        <input type="password" placeholder="Groq API Key" value={siteConfig.groqApiKey} onChange={e => setSiteConfig({...siteConfig, groqApiKey: e.target.value})} className="bg-[#0f172a] border border-red-900 p-3 text-white rounded"/>
                                        <input placeholder="Avatar URL" value={siteConfig.avatarUrl || ''} onChange={e => setSiteConfig({...siteConfig, avatarUrl: e.target.value})} className="bg-[#0f172a] border border-red-900 p-3 text-white rounded"/>
                                        <input placeholder="LinkedIn Profile URL" value={siteConfig.linkedin || ''} onChange={e => setSiteConfig({...siteConfig, linkedin: e.target.value})} className="bg-[#0f172a] border border-red-900 p-3 text-white rounded"/>
                                    </div>
                                    <button onClick={() => db.collection('site_config').doc('main').set(siteConfig, {merge:true})} className="mt-4 bg-red-700 text-white px-6 py-2 rounded text-xs font-bold hover:bg-red-600 transition-colors">SAVE CONFIG</button>
                                </div>
                            )}
                            
                            {adminTab === 'projects' && (
                                <div className="space-y-6">
                                    <div className="bg-[#0f172a] border border-red-900 p-6 rounded-xl">
                                        <h3 className="text-white font-bold mb-4 text-sm flex justify-between">
                                            <span>{editingProject ? 'Edit Project' : 'Add Project'}</span>
                                            {editingProject && <button onClick={() => { setEditingProject(null); setNewProject({ title: '', desc: '', tags: '', link: '', priority: 0, isComplex: false, isMedium: false, isTool: false }); }} className="text-xs text-slate-400 hover:text-white">CANCEL</button>}
                                        </h3>
                                        <div className="grid gap-4">
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2">
                                                    <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded focus:border-blue-500"/>
                                                </div>
                                                <div>
                                                    <input type="number" placeholder="Priority (0-100)" value={newProject.priority} onChange={e => setNewProject({...newProject, priority: e.target.value})} className="w-full bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded focus:border-blue-500"/>
                                                </div>
                                            </div>
                                            <textarea placeholder="Description" rows="3" value={newProject.desc} onChange={e => setNewProject({...newProject, desc: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded focus:border-blue-500"/>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded focus:border-blue-500"/>
                                                <input placeholder="Tags (comma sep)" value={newProject.tags} onChange={e => setNewProject({...newProject, tags: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded focus:border-blue-500"/>
                                            </div>
                                            <div className="flex flex-wrap gap-4 p-3 bg-slate-900/50 rounded border border-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="isComplex" checked={newProject.isComplex} onChange={e => setNewProject({...newProject, isComplex: e.target.checked})} className="w-4 h-4 rounded bg-[#0f172a] border-red-500 accent-yellow-500"/>
                                                    <label htmlFor="isComplex" className="text-xs text-yellow-500 font-bold">⭐ Flagship (Complex)</label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="isMedium" checked={newProject.isMedium} onChange={e => setNewProject({...newProject, isMedium: e.target.checked})} className="w-4 h-4 rounded bg-[#0f172a] border-blue-500 accent-blue-500"/>
                                                    <label htmlFor="isMedium" className="text-xs text-blue-500 font-bold">⚡ Core (Medium)</label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="isTool" checked={newProject.isTool} onChange={e => setNewProject({...newProject, isTool: e.target.checked})} className="w-4 h-4 rounded bg-[#0f172a] border-blue-500 accent-green-500"/>
                                                    <label htmlFor="isTool" className="text-xs text-blue-500 font-bold">🛠️ Tool (Utility)</label>
                                                </div>
                                            </div>
                                            <button onClick={saveProject} className={`py-3 rounded font-bold text-sm text-white transition-colors ${editingProject ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-700 hover:bg-blue-600'}`}>
                                                {editingProject ? 'UPDATE' : 'DEPLOY'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {projects.map(p => (
                                            <div key={p.id} className={`flex justify-between items-center bg-[#0f172a] p-4 border rounded-lg hover:border-blue-500 transition-colors ${editingProject === p.id ? 'border-blue-500' : 'border-gray-800'}`}>
                                                <div>
                                                    <div className="text-white font-bold text-sm flex items-center gap-2">
                                                        {p.title}
                                                        <div className="flex gap-1">
                                                            {p.isComplex && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
                                                            {p.isMedium && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                                            {p.isTool && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-gray-500">Priority: {p.priority || 0}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => startEditProject(p)} className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900"><Icons.Edit size={16}/></button>
                                                    <button onClick={() => deleteDoc('projects', p.id)} className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900"><Icons.Trash size={16}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {adminTab === 'certs' && (
                                 <div className="space-y-6">
                                     <div className="bg-[#0f172a] border border-red-900 p-6 rounded-xl">
                                         <h3 className="text-white font-bold mb-4 text-sm flex justify-between">
                                             <span>{editingCert ? 'Edit Certificate' : 'Add Certificate'}</span>
                                             {editingCert && <button onClick={() => { setEditingCert(null); setNewCert({ title: '', issuer: '', link: '', imageLink: '', priority: 0, tags: '' }); }} className="text-xs text-slate-400 hover:text-white">CANCEL</button>}
                                         </h3>
                                         <div className="grid gap-4">
                                             <input placeholder="Title" value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded"/>
                                             <input placeholder="Issuer" value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded"/>
                                             <div className="grid grid-cols-2 gap-4">
                                                 <input type="number" placeholder="Priority (0-100)" value={newCert.priority} onChange={e => setNewCert({...newCert, priority: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded"/>
                                                 <input placeholder="Tags (comma sep)" value={newCert.tags} onChange={e => setNewCert({...newCert, tags: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded"/>
                                             </div>
                                             <input placeholder="Image URL" value={newCert.imageLink} onChange={e => setNewCert({...newCert, imageLink: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded"/>
                                             <input placeholder="Verify URL" value={newCert.link} onChange={e => setNewCert({...newCert, link: e.target.value})} className="bg-slate-900 border border-gray-700 p-3 text-white text-sm rounded"/>
                                             <button onClick={saveCert} className={`py-3 rounded font-bold text-sm text-white transition-colors ${editingCert ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-700 hover:bg-blue-600'}`}>
                                                 {editingCert ? 'UPDATE' : 'ADD'}
                                             </button>
                                         </div>
                                     </div>
                                     <div className="grid gap-2">
                                         {certifications.map(c => (
                                             <div key={c.id} className={`flex justify-between items-center bg-[#0f172a] p-3 border rounded ${editingCert === c.id ? 'border-blue-500' : 'border-gray-800'}`}>
                                                 <div>
                                                     <div className="text-white text-sm truncate max-w-[200px] font-bold">{c.title}</div>
                                                     <div className="text-[10px] text-gray-500">P: {c.priority || 0} | Tags: {c.tags ? c.tags.length : 0}</div>
                                                 </div>
                                                 <div className="flex gap-2">
                                                     <button onClick={() => startEditCert(c)} className="text-blue-500"><Icons.Edit size={16}/></button>
                                                     <button onClick={() => deleteDoc('certifications', c.id)} className="text-red-500"><Icons.Trash size={16}/></button>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                            )}

                            {adminTab === 'inbox' && (
                                <div className="space-y-4">
                                    {messages.map(m => (
                                        <div key={m.id} className="bg-[#0f172a] border border-gray-800 p-5 rounded-lg hover:border-gray-600 transition-colors">
                                            <div className="flex justify-between text-red-400 font-bold text-sm mb-2">
                                                <span className="flex items-center gap-2"><Icons.User size={14}/> {m.name}</span>
                                                <span className="text-gray-600 text-xs font-mono">{m.timestamp && m.timestamp.seconds ? new Date(m.timestamp.seconds*1000).toLocaleString() : 'Just now'}</span>
                                            </div>
                                            <div className="flex gap-4 text-xs text-gray-500 mb-3 font-mono border-b border-gray-800 pb-2">
                                                <span>COMMS: {m.phone}</span>
                                                <span>TYPE: {m.inquiryType}</span>
                                            </div>
                                            <div className="p-3 bg-red-900/10 border-l-2 border-red-900 text-gray-300 text-sm leading-relaxed">
                                                {m.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
