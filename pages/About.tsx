
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building, UserCheck, Users, Target, ShieldCheck, Award, Zap, Heart } from 'lucide-react';

const RASHID_IMG = "https://i.ibb.co/9kx3Yg31/rashid-portrait.jpg"; // Using a placeholder for the provided image description: Smiling man with green candles background

const About = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const section = useMemo(() => new URLSearchParams(search).get('sec') || 'company', [search]);

  const handleTabChange = (id: string) => {
    navigate(`/about?sec=${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase">
          Empowering <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Financial Freedom</span>
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Earn with Rashid is Pakistan's premier trading education ecosystem, dedicated to creating disciplined and profitable traders.
        </p>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-zinc-800/50 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-800/50">
          {[
            { id: 'company', label: 'Company', icon: Building },
            { id: 'rashid', label: 'Founder', icon: UserCheck },
            { id: 'team', label: 'The Experts', icon: Users },
            { id: 'success', label: 'Impact', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center justify-center gap-2 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${
                section === tab.id 
                  ? 'bg-blue-600/10 text-blue-500 border-b-2 border-blue-500' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 md:p-12 min-h-[400px]">
          {section === 'company' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black tracking-tight">Earn with Rashid</h2>
                  <p className="text-zinc-400 leading-relaxed">
                    Under the visionary leadership of Rashid Ali and technical excellence of our partners at ClyroTech, we have built a platform that bridges the gap between traditional finance and modern algorithmic trading.
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    Our mission is to educate 100,000 traders across Pakistan with professional-grade tools and mentor-style guidance in Roman Urdu.
                  </p>
                  <div className="flex gap-4">
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 flex-1">
                      <Zap className="text-blue-500 mb-2" size={24} />
                      <p className="text-xl font-bold">50k+</p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Active Learners</p>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 flex-1">
                      <ShieldCheck className="text-green-500 mb-2" size={24} />
                      <p className="text-xl font-bold">100%</p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Educational Trust</p>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-3xl h-64 border border-zinc-800 overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1573164060897-425318832a3a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="Office" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <p className="font-bold text-lg">Islamabad HQ</p>
                    <p className="text-xs text-zinc-500">Center for Trading Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'rashid' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/3 shrink-0">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 relative shadow-2xl">
                    <img src={RASHID_IMG} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Rashid Ali" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-2xl font-black tracking-tight">Rashid Ali</h3>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Senior Expert Trader</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-6 pt-4">
                  <h2 className="text-3xl font-black tracking-tight italic">"Dunya ka har kam seekh kar kiya jaye to wo asan hai."</h2>
                  <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                    Rashid Ali is a veteran of the financial markets with over a decade of experience across Global Forex and Crypto exchanges.
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    As the Founder of Earn with Rashid, he has single-handedly transformed how trading is taught in Pakistan, moving away from gambling and towards institutional-level analysis and risk management.
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <span className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">Master Mentor</span>
                    <span className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">Founder</span>
                    <span className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">Macro Specialist</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'team' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-3xl font-black tracking-tight mb-8">The Professional Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { name: 'Rashid Ali', role: 'Founder & Senior Expert Trader', status: 'Mentor', img: RASHID_IMG },
                  { name: 'Muhammad Ali', role: 'Senior Trading Expert', status: 'Professional', img: 'https://i.pravatar.cc/150?u=ma1' },
                  { name: 'Hammad', role: 'Junior Associate & Developer', status: 'Learner / Student', img: 'https://i.pravatar.cc/150?u=h1' },
                ].map(member => (
                  <div key={member.name} className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col items-center text-center group hover:bg-zinc-900 transition-all shadow-xl">
                    <div className="relative mb-6">
                      <img src={member.img} className="w-24 h-24 rounded-2xl grayscale group-hover:grayscale-0 transition-all shadow-xl" alt={member.name} />
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg">
                        <UserCheck size={14} />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">{member.name}</h4>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">{member.role}</p>
                    <div className="mt-4 px-3 py-1 bg-zinc-800 rounded-full text-[9px] font-black text-zinc-500 uppercase tracking-widest">{member.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'success' && (
            <div className="animate-in fade-in duration-500 space-y-12">
              <div className="grid md:grid-cols-3 gap-8">
                 <div className="glass p-6 rounded-3xl text-center space-y-2 border-zinc-800">
                    <p className="text-4xl font-black text-blue-500">5,000+</p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Successful Students</p>
                 </div>
                 <div className="glass p-6 rounded-3xl text-center space-y-2 border-zinc-800">
                    <p className="text-4xl font-black text-green-500">85%</p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Win Rate on Signals</p>
                 </div>
                 <div className="glass p-6 rounded-3xl text-center space-y-2 border-zinc-800">
                    <p className="text-4xl font-black text-purple-500">100%</p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Real Support</p>
                 </div>
              </div>

              <div className="glass p-8 rounded-3xl border-zinc-800 space-y-6 bg-gradient-to-br from-blue-600/5 to-transparent">
                <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight"><Award className="text-yellow-500" /> Community Recognition</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Join a family where your success is our priority. Every student in Rashid Academy is treated as a future professional. We don't just provide signals; we build traders who can find their own setups with clarity and confidence.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800" />)}
                  </div>
                  <p className="text-xs text-zinc-500 font-bold italic">+200 members online right now</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
