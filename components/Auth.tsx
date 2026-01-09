
import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, CheckSquare, Square, ArrowRight } from 'lucide-react';

interface AuthProps {
  onAuth: (userData: any) => void;
}

const RASHID_IMG = "https://i.ibb.co/9kx3Yg31/rashid-portrait.jpg";
const LOGO_URL = "https://i.ibb.co/hR99H2Wv/logo-rashid.png";

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    city: '',
    agree: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      if (form.password !== form.confirmPassword) return alert("Passwords do not match!");
      if (!form.agree) return alert("You must agree to Terms!");
    }
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email: form.email,
      username: form.fullName || form.email.split('@')[0],
      fullName: form.fullName,
      phone: form.phone,
      city: form.city,
      nickname: form.fullName?.split(' ')[0] || 'Trader',
      badge: isAdminMode ? 'Mentor' : 'Beginner',
      role: isAdminMode ? 'admin' : 'user',
      joinedAt: Date.now()
    };
    localStorage.setItem('er_user', JSON.stringify(userData));
    onAuth(userData);
  };

  const updateForm = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 animate-pulse pointer-events-none"></div>
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 glass rounded-[3rem] border-zinc-800 shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">
        
        {/* Visual Side */}
        <div className="hidden md:block relative bg-zinc-900 border-r border-zinc-800 overflow-hidden">
           <img src={RASHID_IMG} className="w-full h-full object-cover grayscale opacity-60" alt="Rashid Mentor" />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
           <div className="absolute bottom-12 left-12 right-12 space-y-4">
              <img src={LOGO_URL} className="w-20 h-20 rounded-3xl shadow-2xl border border-white/10" alt="Logo" />
              <div>
                 <h2 className="text-4xl font-black uppercase tracking-tight text-white leading-none">with Rashid</h2>
                 <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mt-2 italic">Earn with Rashid Academy</p>
              </div>
              <p className="text-zinc-500 font-medium text-sm leading-relaxed">"Ghar bethe trading seekhein aur professional banein Rashid Ali ke sath. Hamara maqsad aapka financial future hai."</p>
           </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center bg-zinc-950/40">
           <div className="text-center md:text-left flex flex-col items-center md:items-start gap-4">
              <img src={LOGO_URL} className="w-12 h-12 rounded shadow-lg md:hidden" alt="Logo" />
              <div className="flex flex-col gap-1">
                 <h1 className="text-2xl font-black uppercase tracking-tight">{isLogin ? 'Command Access' : 'Join Rashid'}</h1>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{isLogin ? 'Identity check required' : 'Begin your institutional journey'}</p>
              </div>
           </div>

           <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input type="text" required className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm" placeholder="Full Name" value={form.fullName} onChange={e => updateForm('fullName', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                       <input type="text" required className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-10 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm" placeholder="Phone" value={form.phone} onChange={e => updateForm('phone', e.target.value)} />
                    </div>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                       <input type="text" required className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-10 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm" placeholder="City" value={form.city} onChange={e => updateForm('city', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input type="email" required className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm" placeholder="Email Address" value={form.email} onChange={e => updateForm('email', e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input type="password" required className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm" placeholder="Password" value={form.password} onChange={e => updateForm('password', e.target.value)} />
              </div>

              {!isLogin && (
                 <div className="space-y-3">
                    <button type="button" onClick={() => setIsAdminMode(!isAdminMode)} className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isAdminMode ? 'text-blue-500' : 'text-zinc-600'}`}>
                       {isAdminMode ? <CheckSquare size={16} /> : <Square size={16} />} Request Mentor Status
                    </button>
                    <div className="flex items-center gap-2">
                       <button type="button" onClick={() => updateForm('agree', !form.agree)} className="text-blue-500">{form.agree ? <CheckSquare size={18} /> : <Square size={18} />}</button>
                       <span className="text-[9px] text-zinc-500 uppercase font-black">Accept Rules & Privacy Policy</span>
                    </div>
                 </div>
              )}

              <button type="submit" className="w-full flex items-center justify-center gap-2 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30 active:scale-95">
                {isLogin ? 'Access Identity' : 'Register Now'} <ArrowRight size={18} />
              </button>
           </form>

           <div className="text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-blue-500 transition-colors">
                {isLogin ? "Member? Create Account" : "Access? Login Here"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
