
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
    { label: 'Equity', value: `$${balance.toLocaleString()}`, icon: Zap, color: 'text-blue-500' },
    { label: 'Total P/L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, icon: TrendingUp, color: totalPnl >= 0 ? 'text-green-500' : 'text-red-500' },
    { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, icon: Target, color: 'text-purple-500' },
    { label: 'Rank', value: user.badge, icon: Award, color: 'text-yellow-500' },
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
    <div className="space-y-6 md:space-y-8 py-4 md:py-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1 md:mb-2 uppercase">Command Center</h1>
          <p className="text-zinc-500 text-xs md:text-sm font-medium">Review your trading journey and manage your identity.</p>
        </div>
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 shadow-xl self-start">
          <button onClick={() => setTab('stats')} className={`px-4 md:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Analytics</button>
          <button onClick={() => setTab('profile')} className={`px-4 md:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Identity</button>
        </div>
      </div>

      {tab === 'stats' ? (
        <div className="space-y-6 md:space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass p-4 md:p-8 rounded-2xl md:rounded-[2rem] border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl group">
                <div className={`mb-3 md:mb-6 ${stat.color} group-hover:scale-110 transition-transform bg-zinc-900/50 w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center`}>
                  <stat.icon size={16} className="md:size-6" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase mb-0.5 md:mb-1.5 tracking-widest">{stat.label}</p>
                  <p className="text-lg md:text-3xl font-black tracking-tight font-mono">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Matrix & Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 glass rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border-zinc-800 shadow-2xl flex flex-col h-[350px] md:h-[450px]">
              <div className="flex items-center justify-between mb-6 md:mb-10">
                 <h3 className="text-sm md:text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-500"/> Performance
                 </h3>
                 <div className="flex gap-1.5 md:gap-2">
                    {['1W', '1M', 'All'].map(t => <span key={t} className="px-2 md:px-3 py-1 bg-zinc-900 rounded-lg text-[8px] md:text-[10px] font-black text-zinc-500 hover:text-blue-500 cursor-pointer transition-colors">{t}</span>)}
                 </div>
              </div>
              
              <div className="flex-1 flex items-end gap-1.5 md:gap-3 px-1 md:px-4 border-b border-l border-zinc-800/50 relative">
                 {[35, 65, 40, 85, 60, 95, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/5 to-blue-600/30 rounded-t-lg md:rounded-t-2xl transition-all hover:to-blue-600 group relative" style={{ height: `${h}%` }}>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl z-10">
                         ${(h * 150).toLocaleString()}
                       </div>
                    </div>
                 ))}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.01]">
                    <TrendingUp size={200} className="md:size-[300px]" />
                 </div>
              </div>
            </div>

            <div className="glass rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border-zinc-800 shadow-2xl flex flex-col h-[350px] md:h-auto md:min-h-[450px]">
              <h3 className="text-sm md:text-xl font-black mb-4 md:mb-8 flex items-center gap-2 uppercase tracking-tight">
                <History size={18} className="text-blue-500" /> Logs
              </h3>
              <div className="space-y-3 overflow-y-auto pr-2 no-scrollbar flex-1">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-800 opacity-20">
                     <History size={48} />
                     <p className="text-[8px] font-black uppercase mt-2 tracking-widest">No Logs</p>
                  </div>
                ) : (
                  history.slice(0, 8).map(trade => (
                    <div key={trade.id} className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-zinc-900/50 border border-zinc-800 group hover:border-blue-500/50 transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-0.5 h-full bg-blue-600 opacity-20"></div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xs md:text-sm uppercase">{trade.symbol}</span>
                        <span className={`text-[10px] md:text-[11px] font-black font-mono ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[8px] md:text-[10px] text-zinc-600 font-black uppercase tracking-[0.1em]">
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
           <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
              <div className="lg:col-span-4 glass rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border-zinc-800 text-center space-y-6 md:space-y-8 shadow-2xl h-fit">
                 <div className="relative inline-block group">
                    <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl md:rounded-[2.5rem] bg-zinc-900 border-4 border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center transition-all group-hover:border-blue-600/50">
                       {user.profilePic ? (
                          <img src={user.profilePic} className="w-full h-full object-cover" />
                       ) : (
                          <UserIcon size={32} className="text-zinc-700 md:size-[64px] group-hover:text-blue-500 transition-colors" />
                       )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-blue-600 p-2 md:p-3 rounded-xl md:rounded-2xl border-2 md:border-4 border-zinc-950 text-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                       <Camera size={16} md:size={20} />
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
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{user.nickname}</h2>
                    <p className="text-blue-500 text-[8px] md:text-xs font-black uppercase tracking-[0.3em] mt-1 md:mt-2 italic">{user.badge} Level</p>
                 </div>
                 
                 <div className="pt-6 md:pt-8 border-t border-zinc-800 flex flex-col gap-2">
                    <button 
                       onClick={() => { localStorage.clear(); window.location.reload(); }}
                       className="w-full py-3 md:py-4 bg-red-600/10 text-red-500 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600/20 transition-all border border-red-500/10"
                    >
                       <LogOut size={16} md:size={18} /> Logout
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-8 glass rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border-zinc-800 space-y-6 md:space-y-10 shadow-2xl">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 md:gap-3">
                       <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600/10 rounded-lg md:rounded-xl flex items-center justify-center text-blue-500"><UserIcon size={18} md:size={20}/></div>
                       <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight">Identity</h3>
                    </div>
                    <button 
                       onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                       className={`flex items-center gap-1.5 px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-green-600 text-white shadow-lg' : 'bg-zinc-900 text-blue-500 border border-zinc-800 hover:border-blue-500'}`}
                    >
                       {isEditing ? <><CheckCircle2 size={14}/> Save</> : <><Edit2 size={14}/> Edit</>}
                    </button>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2"><Target size={10}/> Public Nickname</label>
                       {isEditing ? (
                         <input 
                           value={profileForm.nickname} 
                           onChange={e => setProfileForm({...profileForm, nickname: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl outline-none focus:border-blue-500 font-bold transition-all text-sm" 
                         />
                       ) : (
                         <p className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-[13px] font-black text-zinc-300">{user.nickname}</p>
                       )}
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2"><Phone size={10}/> Phone</label>
                       {isEditing ? (
                         <input 
                           value={profileForm.phone} 
                           onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl outline-none focus:border-blue-500 font-bold transition-all text-sm" 
                         />
                       ) : (
                         <p className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-[13px] font-black text-zinc-300">{user.phone}</p>
                       )}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2"><MapPin size={10}/> City</label>
                       {isEditing ? (
                         <input 
                           value={profileForm.city} 
                           onChange={e => setProfileForm({...profileForm, city: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl outline-none focus:border-blue-500 font-bold transition-all text-sm" 
                         />
                       ) : (
                         <p className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-[13px] font-black text-zinc-300">{user.city}</p>
                       )}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={10}/> Status</label>
                       <div className="p-3 bg-green-500/5 rounded-xl border border-green-500/20 text-[9px] font-black text-green-500 uppercase flex items-center gap-2">
                          <CheckCircle2 size={14}/> Institutional Active
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
