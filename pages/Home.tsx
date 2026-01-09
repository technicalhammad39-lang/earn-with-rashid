
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  PlayCircle, 
  Star, 
  Zap, 
  Users, 
  Target, 
  BrainCircuit,
  ArrowRight,
  BarChart2,
  ChevronRight,
  Globe,
  Award,
  Verified,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../types';

const RASHID_IMG = "https://i.ibb.co/9kx3Yg31/rashid-portrait.jpg";

const FeatureCard = ({ icon: Icon, title, desc, link, linkText }: { icon: any, title: string, desc: string, link: string, linkText: string }) => (
  <div className="group p-8 rounded-[2.5rem] border border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-500 flex flex-col h-full shadow-lg">
    <div className="mb-6 text-blue-500 bg-blue-500/5 w-14 h-14 rounded-2xl flex items-center justify-center border border-blue-500/10 group-hover:scale-110 transition-transform">
      <Icon size={26} />
    </div>
    <h3 className="text-xl font-bold tracking-tight mb-3 text-zinc-100">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed font-medium mb-8 flex-grow">{desc}</p>
    <Link to={link} className="inline-flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest group-hover:gap-3 transition-all">
      {linkText} <ChevronRight size={14} />
    </Link>
  </div>
);

const MentorIntro = ({ settings }: { settings: SiteSettings }) => (
  <section className="py-16 md:py-24 px-4 bg-zinc-950">
    <div className="max-w-sm mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl text-center">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border border-zinc-800 shadow-sm">
          <img 
            src={RASHID_IMG} 
            alt="Rashid" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Rashid
          </h2>
          <p className="text-sm text-zinc-400 font-normal">
            Founder & Mentor – {settings.brandName}
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Home = ({ settings }: { settings: SiteSettings }) => {
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-1000">
      
      {/* Hero Section */}
      <section className="relative pt-6 md:pt-10">
        <div className="max-w-4xl mx-auto glass rounded-[3rem] p-8 md:p-16 border-zinc-800/40 bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-blue-900/5 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-start text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <ShieldCheck size={14} /> #1 Trading Academy in Pakistan
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight text-white">
              Empowering <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Financial Freedom</span>
            </h1>
            
            <p className="text-base md:text-lg text-zinc-400 mb-10 leading-relaxed font-medium">
              Join Rashid Academy and master institutional price action. Trade like the banks, manage risk like a pro, and start your journey with a real-time simulator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/academy" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30 active:scale-95">
                Start Learning <BookOpen size={18} />
              </Link>
              <Link to="/trading" className="px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-2xl border border-zinc-800 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                Try Live Trading <PlayCircle size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MentorIntro settings={settings} />

      <section className="space-y-12 py-10">
        <div className="text-center space-y-3">
          <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade</div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Why Choose Our Platform</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Award} 
            title="Professional Academy" 
            desc="Learn institutional price action models used by banks and hedge funds, explained in simple Roman Urdu for better grasp."
            link="/academy"
            linkText="Explore Courses"
          />
          <FeatureCard 
            icon={BarChart2} 
            title="Real-time Trading Terminal" 
            desc="Practice your strategies on a high-fidelity simulator synced with global market movements. Fully real-time logic."
            link="/trading"
            linkText="Launch Terminal"
          />
          <FeatureCard 
            icon={BrainCircuit} 
            title="AI Mentor Analysis" 
            desc="Our proprietary AI analyzes market structure and liquidity pools to provide insights based on Rashid's trading logic."
            link="/dashboard"
            linkText="Check Stats"
          />
        </div>
      </section>

      {/* Development Credit Section */}
      <section className="py-20 border-t border-zinc-800/50 text-center">
         <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mb-4">Masterpiece Engineered By</p>
         <a 
           href="https://maps.app.goo.gl/3XyVv8Jk8vXv5zXN8" 
           target="_blank" 
           rel="noopener noreferrer"
           className="group inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-blue-500 transition-all duration-500 shadow-2xl"
         >
           <span className="text-lg font-black tracking-tight text-white group-hover:text-blue-500 transition-colors">Developed by <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-4">Hammad – Clyro Tech Solutions</span></span>
           <ExternalLink size={18} className="text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
         </a>
      </section>
    </div>
  );
};

export default Home;
