
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, MapPin, CheckSquare, Square, ArrowRight } from 'lucide-react';

interface AuthProps {
  onAuth: (userData: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
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
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (!form.agree) {
        alert("You must agree to the Terms & Conditions!");
        return;
      }
    }

    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email: form.email,
      username: form.fullName || form.email.split('@')[0],
      fullName: form.fullName,
      phone: form.phone,
      city: form.city,
      nickname: form.fullName?.split(' ')[0] || 'Trader',
      badge: 'Beginner'
    };
    
    localStorage.setItem('er_user', JSON.stringify(userData));
    onAuth(userData);
  };

  const updateForm = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-3xl border-zinc-800 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl italic mx-auto mb-6 shadow-xl shadow-blue-900/40">R</div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            {isLogin ? 'Login to your trading platform' : 'Join Rashid Trading Academy'}
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) => updateForm('fullName', e.target.value)}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="email"
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="password"
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
              placeholder="Password"
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
            />
          </div>

          {!isLogin && (
            <>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) => updateForm('confirmPassword', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 px-1">
                <button 
                  type="button"
                  onClick={() => updateForm('agree', !form.agree)}
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {form.agree ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                  I agree with <span className="text-blue-500">Terms & Conditions</span>
                </span>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98]"
          >
            {isLogin ? 'Login Now' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-blue-500 transition-colors"
          >
            {isLogin ? "New user? Register here" : "Member already? Login here"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Secure Trading Portal</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
