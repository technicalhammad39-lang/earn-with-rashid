
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Target, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  BarChart3, 
  Globe, 
  Save, 
  CheckCircle2,
  ShieldAlert,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  X,
  PlayCircle,
  FileText
} from 'lucide-react';
import { User, Course, Signal, SiteSettings, Chapter, Lesson, MarketType } from '../types';

interface AdminProps {
  user: User;
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
  courses: Course[];
  setCourses: (c: Course[]) => void;
  signals: Signal[];
  setSignals: (s: Signal[]) => void;
}

const Admin: React.FC<AdminProps> = ({ user, settings, setSettings, courses, setCourses, signals, setSignals }) => {
  const [activeTab, setActiveTab] = useState<'dash' | 'users' | 'courses' | 'signals' | 'settings'>('dash');
  const [notification, setNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Unauthorized Gate
  if (user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center text-red-500 mb-6 shadow-2xl">
          <ShieldAlert size={40} className="animate-pulse" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Access Denied</h1>
        <p className="text-zinc-500 max-w-sm mb-8 font-medium italic">
          Yeh area sirf Rashid Mentor aur Authorized Staff ke liye hai.
        </p>
        <button onClick={() => window.location.href = '#/'} className="px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-100 hover:bg-zinc-800 transition-all active:scale-95">
          Take Me Home
        </button>
      </div>
    );
  }

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSettings({
      brandName: formData.get('brandName') as string,
      logoText: formData.get('logoText') as string,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      announcement: formData.get('announcement') as string,
    });
    showNotify("Platform Settings Updated!");
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCourse: Course = {
      id: editingItem?.id || `c-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      level: 'Beginner → Intermediate',
      thumbnail: formData.get('thumbnail') as string || 'https://images.unsplash.com/photo-1611974717482-48092895b9b8?auto=format&fit=crop&q=80&w=600',
      chapters: editingItem?.chapters || [{ id: 'ch1', title: 'Getting Started', lessons: [] }]
    };

    if (editingItem) {
      setCourses(courses.map(c => c.id === editingItem.id ? newCourse : c));
    } else {
      setCourses([newCourse, ...courses]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
    showNotify("Course Inventory Synced!");
  };

  const deleteCourse = (id: string) => {
    if(window.confirm("Permanently remove this course?")) {
      setCourses(courses.filter(c => c.id !== id));
      showNotify("Course Removed.");
    }
  };

  // Add 'market' property to newSignal to fix the reported error.
  const handleSaveSignal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSignal: Signal = {
      id: `s-${Date.now()}`,
      pair: formData.get('pair') as string,
      type: formData.get('type') as 'BUY' | 'SELL',
      market: formData.get('market') as MarketType,
      entry: formData.get('entry') as string,
      tp: formData.get('tp') as string,
      sl: formData.get('sl') as string,
      confidence: Number(formData.get('confidence')),
      timeframe: formData.get('timeframe') as string,
      explanation: formData.get('explanation') as string,
      status: 'Active'
    };

    setSignals([newSignal, ...signals]);
    setIsModalOpen(false);
    showNotify("New Signal Dispatched!");
  };

  return (
    <div className="min-h-screen pb-12 animate-in fade-in duration-500">
      {/* Admin Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Admin Console</h1>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] italic">Authorized: {user.nickname}</p>
          </div>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-2 p-1 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          {[
            { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'courses', label: 'Academy', icon: BookOpen },
            { id: 'signals', label: 'Signals', icon: Target },
            { id: 'settings', label: 'System', icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/10' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8 max-w-5xl mx-auto">
        {notification && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-green-600 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
             <CheckCircle2 size={20} />
             <p className="text-xs font-black uppercase tracking-widest">{notification}</p>
          </div>
        )}

        {activeTab === 'dash' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: 'Platform Users', value: '1,250', icon: Users, color: 'text-blue-500' },
                { label: 'Active Signals', value: signals.length, icon: Target, color: 'text-green-500' },
                { label: 'Lessons Taught', value: courses.reduce((acc, c) => acc + c.chapters.reduce((a, ch) => a + ch.lessons.length, 0), 0), icon: BookOpen, color: 'text-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="glass p-8 rounded-[2rem] border-zinc-800 space-y-4 hover:border-zinc-700 transition-all group">
                  <stat.icon className={stat.color} size={24} />
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="glass rounded-[2.5rem] p-8 border-zinc-800">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2"><TrendingUp size={18} className="text-blue-500" /> Recent User Activity</h3>
                 <button className="text-[10px] font-black uppercase text-blue-500 hover:underline">View All Logs</button>
               </div>
               <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] font-black">U{i}</div>
                         <div>
                           <p className="text-xs font-bold">New user joined from Karachi</p>
                           <p className="text-[9px] text-zinc-600 font-black uppercase">2 minutes ago</p>
                         </div>
                       </div>
                       <ChevronRight size={16} className="text-zinc-700" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handleUpdateSettings} className="glass rounded-[2.5rem] p-8 md:p-12 border-zinc-800 space-y-8 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Global Config</h2>
                  <p className="text-[9px] text-zinc-500 font-black uppercase">Platform branding and strings</p>
               </div>
               <button type="submit" className="px-8 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 flex items-center gap-2">
                 <Save size={16} /> Update Live
               </button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Brand Name</label>
                  <input name="brandName" defaultValue={settings.brandName} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Logo Initial</label>
                  <input name="logoText" defaultValue={settings.logoText} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold" />
               </div>
               <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Hero Landing Title</label>
                  <input name="heroTitle" defaultValue={settings.heroTitle} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold" />
               </div>
               <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Sidebar Announcement</label>
                  <textarea name="announcement" defaultValue={settings.announcement} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-medium h-24 resize-none" />
               </div>
            </div>
          </form>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight">Academy Inventory</h2>
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
              >
                <Plus size={16} /> New Module
              </button>
            </div>

            <div className="grid gap-4">
              {courses.map(course => (
                <div key={course.id} className="glass p-6 rounded-3xl border-zinc-800 flex items-center justify-between group hover:bg-zinc-900/50 transition-all">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-10 rounded-xl overflow-hidden bg-zinc-900">
                       <img src={course.thumbnail} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                     </div>
                     <div>
                       <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{course.category}</p>
                       <h3 className="font-bold tracking-tight text-sm md:text-base">{course.title}</h3>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => { setEditingItem(course); setIsModalOpen(true); }}
                        className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteCourse(course.id)}
                        className="p-2.5 bg-red-600/10 rounded-xl text-red-500 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black uppercase tracking-tight">Signal Dispatch</h2>
               <button 
                 onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                 className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
               >
                 <Plus size={16} /> Create Signal
               </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
               {signals.map(s => (
                 <div key={s.id} className="glass p-6 rounded-3xl border-zinc-800 space-y-4">
                    <div className="flex justify-between items-center">
                       <h4 className="font-black text-lg">{s.pair}</h4>
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${s.type === 'BUY' ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-500'}`}>{s.type}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="text-[10px] text-zinc-500 font-bold uppercase">Market: <span className="text-blue-500">{s.market}</span></div>
                       <div className="text-[10px] text-zinc-500 font-bold uppercase text-right">Confidence: <span className="text-blue-500">{s.confidence}%</span></div>
                       <div className="text-[10px] text-zinc-500 font-bold uppercase">Entry: <span className="text-zinc-100">{s.entry}</span></div>
                       <div className="text-[10px] text-zinc-500 font-bold uppercase">Target: <span className="text-green-500">{s.tp}</span></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic CRUD Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
           <div className="w-full max-w-xl glass rounded-[2.5rem] border-zinc-800 p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X size={24}/></button>
              
              {activeTab === 'courses' ? (
                <form onSubmit={handleSaveCourse} className="space-y-6">
                   <h2 className="text-2xl font-black uppercase tracking-tight">{editingItem ? 'Edit Module' : 'Add New Module'}</h2>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Title</label>
                        <input name="title" required defaultValue={editingItem?.title} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Category</label>
                        <select name="category" defaultValue={editingItem?.category || 'strategies'} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold">
                           <option value="basics">Basics</option>
                           <option value="strategies">Strategies</option>
                           <option value="psychology">Psychology</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Short Description</label>
                        <textarea name="description" required defaultValue={editingItem?.description} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-medium h-24 resize-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Thumbnail URL</label>
                        <input name="thumbnail" defaultValue={editingItem?.thumbnail} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-mono text-xs" placeholder="https://..." />
                      </div>
                   </div>
                   <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                      Save Course Data
                   </button>
                </form>
              ) : activeTab === 'signals' ? (
                <form onSubmit={handleSaveSignal} className="space-y-6">
                   <h2 className="text-2xl font-black uppercase tracking-tight">Broadcast Signal</h2>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Asset Pair (e.g. BTC/USDT)</label>
                        <input name="pair" required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-black uppercase" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Type</label>
                        <select name="type" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold">
                           <option value="BUY">BUY</option>
                           <option value="SELL">SELL</option>
                        </select>
                      </div>
                      {/* Added 'market' selection to fix missing 'market' property in Signal type */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Market</label>
                        <select name="market" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold">
                           <option value="Crypto">Crypto</option>
                           <option value="Forex">Forex</option>
                           <option value="Stocks">Stocks</option>
                           <option value="Binary Options">Binary Options</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Timeframe</label>
                        <input name="timeframe" defaultValue="1H" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Entry</label>
                        <input name="entry" required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Take Profit</label>
                        <input name="tp" required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-mono text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Stop Loss</label>
                        <input name="sl" required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-mono text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Confidence %</label>
                        <input type="number" name="confidence" defaultValue="90" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase">Mentor Explanation (Urdu)</label>
                        <textarea name="explanation" required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-medium h-24 resize-none" placeholder="Market structure break hua hai..." />
                      </div>
                   </div>
                   <button type="submit" className="w-full py-4 bg-green-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                      Dispatch to Community
                   </button>
                </form>
              ) : null}
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
