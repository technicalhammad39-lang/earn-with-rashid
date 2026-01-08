
import React, { useState, useMemo } from 'react';
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
  Bell, 
  Save, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { User, Course, Signal, SiteSettings } from '../types';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Security Check
  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <ShieldAlert size={64} className="text-red-500 animate-pulse" />
        <h1 className="text-2xl font-black uppercase tracking-tight">Access Restricted</h1>
        <p className="text-zinc-500 max-w-sm">Only authorized mentors and administrators can access the command center.</p>
        <button onClick={() => window.location.href = '#/'} className="px-6 py-2 bg-blue-600 rounded-xl text-xs font-black uppercase">Go Home</button>
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
    showNotify("Settings Updated Successfully!");
  };

  const deleteCourse = (id: string) => {
    if(window.confirm("Delete this course permanently?")) {
      setCourses(courses.filter(c => c.id !== id));
      showNotify("Course Removed");
    }
  };

  return (
    <div className="min-h-screen pb-12 animate-in fade-in duration-500">
      {/* Top Admin Branding */}
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-900/20">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Admin Console</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Institutional Management Level 4</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-zinc-900 rounded-xl border border-zinc-800 text-[10px] font-black uppercase text-blue-500">Live Server Active</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'courses', label: 'Academy Control', icon: BookOpen },
            { id: 'signals', label: 'Signal Engine', icon: Target },
            { id: 'settings', label: 'Global Branding', icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                activeTab === tab.id 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/20' 
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {notification && (
            <div className="bg-green-600 text-white p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 shadow-xl">
               <CheckCircle2 size={20} />
               <p className="text-xs font-black uppercase tracking-widest">{notification}</p>
            </div>
          )}

          {activeTab === 'dash' && (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { label: 'Total Scalpers', value: '12,482', icon: Users, color: 'text-blue-500' },
                  { label: 'Course Enrollments', value: '45,091', icon: BookOpen, color: 'text-purple-500' },
                  { label: 'Active Signals', value: signals.filter(s => s.status === 'Active').length, icon: Target, color: 'text-green-500' }
                ].map((stat, i) => (
                  <div key={i} className="glass p-8 rounded-[2rem] border-zinc-800 space-y-4">
                    <stat.icon className={stat.color} size={24} />
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-[2.5rem] p-8 border-zinc-800">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-500" /> Platform Growth
                </h3>
                <div className="h-48 flex items-end gap-2 px-2">
                  {[20, 45, 30, 80, 50, 95, 70, 100, 85, 120].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/5 to-blue-600/40 rounded-t-xl group relative h-full">
                       <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-xl transition-all" style={{ height: `${h/1.2}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleUpdateSettings} className="glass rounded-[2.5rem] p-10 border-zinc-800 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight">Site Configuration</h3>
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95">
                  <Save size={16} /> Save Changes
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Platform Brand Name</label>
                  <input name="brandName" defaultValue={settings.brandName} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Logo Initial/Text</label>
                  <input name="logoText" defaultValue={settings.logoText} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Hero Landing Title</label>
                  <input name="heroTitle" defaultValue={settings.heroTitle} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Announcement Bar</label>
                  <textarea name="announcement" defaultValue={settings.announcement} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium h-24 resize-none" />
                </div>
              </div>
            </form>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight">Course Inventory</h3>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  <Plus size={16} /> Add New Course
                </button>
              </div>

              <div className="grid gap-4">
                {courses.map(course => (
                  <div key={course.id} className="glass p-6 rounded-3xl border-zinc-800 flex items-center justify-between group hover:bg-zinc-900/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-800">
                        <img src={course.thumbnail} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{course.category}</p>
                        <h4 className="font-bold text-zinc-100">{course.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white"><Edit2 size={16} /></button>
                      <button onClick={() => deleteCourse(course.id)} className="p-3 bg-red-600/10 rounded-xl text-red-500 hover:bg-red-600 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="glass rounded-[2.5rem] overflow-hidden border-zinc-800">
              <div className="p-8 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest">Registered Personnel</h3>
                <div className="flex gap-2">
                   <input placeholder="Search UID or Email..." className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-900 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-4">Identity</th>
                      <th className="px-8 py-4">Account Type</th>
                      <th className="px-8 py-4">City/Region</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {[
                      { name: user.nickname, email: user.email, role: user.role, city: user.city, country: 'Pakistan', status: 'Active' },
                      { name: 'Ahmed_Fx', email: 'ahmed@trade.com', role: 'user', city: 'Karachi', country: 'Pakistan', status: 'Active' },
                      { name: 'GoldHunter', email: 'gold@scalp.pk', role: 'user', city: 'Lahore', country: 'Pakistan', status: 'Banned' },
                    ].map((u, i) => (
                      <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-black uppercase text-zinc-500">{u.name[0]}</div>
                             <div>
                               <p className="text-[13px] font-black">{u.name}</p>
                               <p className="text-[10px] text-zinc-600">{u.email}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-600/10 text-purple-500' : 'bg-blue-600/10 text-blue-500'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-[11px] font-bold text-zinc-400">{u.city}</p>
                           <p className="text-[9px] text-zinc-600 uppercase font-black">{u.country}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{u.status}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2 text-zinc-700 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
