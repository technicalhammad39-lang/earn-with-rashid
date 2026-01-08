
import React, { useState, useRef } from 'react';
import { Position, TradeHistory, User } from '../types';
import { TrendingUp, Target, Award, Zap, History, User as UserIcon, Camera, Edit2, LogOut, CheckCircle2, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  balance: number;
  positions: Position[];
  history: TradeHistory[];
  user: User;
  setUser: (u: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ balance, positions, history, user, setUser }) => {
  const [tab, setTab] = useState<'stats' | 'profile'>('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    nickname: user.nickname, 
    fullName: user.fullName, 
    phone: user.phone, 
    city: user.city 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalTrades = history.length;
  const winTrades = history.filter(h => h.pnl > 0).length;
  const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
  const totalPnl = history.reduce((acc, curr) => acc + curr.pnl, 0);

  const stats = [
    { label: 'Practice Balance', value: `$${balance.toLocaleString()}`, icon: Zap, color: 'text-blue-500' },
    { label: 'Cumulative P/L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, icon: TrendingUp, color: totalPnl >= 0 ? 'text-green-500' : 'text-red-500' },
    { label: 'Platform Accuracy', value: `${winRate.toFixed(1)}%`, icon: Target, color: 'text-purple-500' },
    { label: 'Academy Badge', value: user.badge, icon: Award, color: 'text-yellow-500' },
  ];

  const handleSaveProfile = () => {
    const updatedUser = { 
      ...user, 
      nickname: profileForm.nickname, 
      fullName: profileForm.fullName,
      phone: profileForm.phone,
      city: profileForm.city
    };
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUser({ ...user, profilePic: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Command Center</h1>
          <p className="text-zinc-500 font-medium">Review your trading journey and manage your identity.</p>
        </div>
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 shadow-xl self-start md:self-auto">
          <button onClick={() => setTab('stats')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Analytics</button>
          <button onClick={() => setTab('profile')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Identity</button>
        </div>
      </div>

      {tab === 'stats' ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass p-8 rounded-[2rem] border-zinc-800 hover:border-zinc-700 transition-all shadow-2xl group flex flex-col justify-between">
                <div className={`mb-6 ${stat.color} group-hover:scale-110 transition-transform bg-zinc-900/50 w-12 h-12 rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1.5 tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tight font-mono">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 min-h-[450px] border-zinc-800 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <TrendingUp size={22} className="text-blue-500"/> Performance Matrix
                 </h3>
                 <div className="flex gap-2">
                    {['1D', '1W', '1M', 'All'].map(t => <span key={t} className="px-3 py-1 bg-zinc-900 rounded-lg text-[10px] font-black text-zinc-500 hover:text-blue-500 cursor-pointer transition-colors">{t}</span>)}
                 </div>
              </div>
              
              <div className="flex-1 flex items-end gap-3 px-4 border-b border-l border-zinc-800/50 relative">
                 {[35, 65, 40, 85, 60, 95, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/5 to-blue-600/30 rounded-t-2xl transition-all hover:to-blue-600 group relative" style={{ height: `${h}%` }}>
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl">
                         ${(h * 150).toLocaleString()}
                       </div>
                    </div>
                 ))}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                    <TrendingUp size={300} />
                 </div>
              </div>
            </div>

            <div className="glass rounded-[2.5rem] p-8 border-zinc-800 shadow-2xl flex flex-col">
              <h3 className="text-xl font-black mb-8 flex items-center gap-2 uppercase tracking-tight">
                <History size={22} className="text-blue-500" /> Recent Activity
              </h3>
              <div className="space-y-4 overflow-y-auto max-h-[500px] no-scrollbar flex-1">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-zinc-700 opacity-20">
                     <History size={64} />
                     <p className="text-xs font-black uppercase mt-4 tracking-widest">No Logs</p>
                  </div>
                ) : (
                  history.slice(0, 10).map(trade => (
                    <div key={trade.id} className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 group hover:border-blue-500/50 transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-1 h-full bg-blue-600 opacity-20"></div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm uppercase">{trade.symbol}</span>
                        <span className={`text-[11px] font-black font-mono ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-600 font-black uppercase tracking-[0.15em]">
                         <span>{trade.type} • {trade.exitType}</span>
                         <span className="opacity-60">{new Date(trade.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-10 duration-600">
           <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 glass rounded-[2.5rem] p-10 border-zinc-800 text-center space-y-8 shadow-2xl h-fit">
                 <div className="relative inline-block group">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-zinc-900 border-4 border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center transition-all group-hover:border-blue-600/50">
                       {user.profilePic ? (
                          <img src={user.profilePic} className="w-full h-full object-cover" />
                       ) : (
                          <UserIcon size={64} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                       )}
                    </div>
                    <label className="absolute -bottom-3 -right-3 bg-blue-600 p-3 rounded-2xl border-4 border-zinc-950 text-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                       <Camera size={20} />
                       <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden" 
                          accept="image/*" 
                       />
                    </label>
                 </div>
                 <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">{user.nickname}</h2>
                    <p className="text-blue-500 text-xs font-black uppercase tracking-[0.4em] mt-2 italic">{user.badge} Level</p>
                 </div>
                 
                 <div className="pt-8 border-t border-zinc-800 flex flex-col gap-3">
                    <button 
                       onClick={() => { localStorage.clear(); window.location.reload(); }}
                       className="w-full py-4 bg-red-600/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600/20 transition-all border border-red-500/10"
                    >
                       <LogOut size={18} /> Logout
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-8 glass rounded-[2.5rem] p-10 border-zinc-800 space-y-10 shadow-2xl">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500"><UserIcon size={20}/></div>
                       <h3 className="text-2xl font-black uppercase tracking-tight">Modify Identity</h3>
                    </div>
                    <button 
                       onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                       className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-green-600 text-white shadow-lg' : 'bg-zinc-900 text-blue-500 border border-zinc-800 hover:border-blue-500'}`}
                    >
                       {isEditing ? <><CheckCircle2 size={16}/> Save</> : <><Edit2 size={16}/> Edit</>}
                    </button>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><Target size={12}/> Public Nickname</label>
                       {isEditing ? (
                         <input 
                           value={profileForm.nickname} 
                           onChange={e => setProfileForm({...profileForm, nickname: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all" 
                         />
                       ) : (
                         <p className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-sm font-black text-zinc-300">{user.nickname}</p>
                       )}
                       <p className="text-[9px] text-zinc-500 font-bold uppercase">Visible to all community members</p>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><UserIcon size={12}/> Full Legal Name</label>
                       {isEditing ? (
                         <input 
                           value={profileForm.fullName} 
                           onChange={e => setProfileForm({...profileForm, fullName: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all" 
                         />
                       ) : (
                         <p className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 text-sm font-bold text-zinc-500 italic">Hidden (Private)</p>
                       )}
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><Mail size={12}/> Email Identity</label>
                       <p className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 text-sm font-bold text-zinc-500 italic">Hidden (Private)</p>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><Phone size={12}/> Registered Phone</label>
                       {isEditing ? (
                         <input 
                           value={profileForm.phone} 
                           onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all" 
                         />
                       ) : (
                         <p className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-sm font-black text-zinc-300">{user.phone}</p>
                       )}
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><MapPin size={12}/> Current City</label>
                       {isEditing ? (
                         <input 
                           value={profileForm.city} 
                           onChange={e => setProfileForm({...profileForm, city: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all" 
                         />
                       ) : (
                         <p className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-sm font-black text-zinc-300">{user.city}</p>
                       )}
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><ShieldCheck size={12}/> Account Status</label>
                       <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/20 text-[10px] font-black text-green-500 uppercase flex items-center gap-3">
                          <CheckCircle2 size={16}/> Institutional Access Active
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
