
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  BarChart2, 
  BookOpen, 
  LayoutDashboard, 
  Target, 
  Menu,
  X,
  User as UserIcon,
  Youtube,
  Send as Telegram,
  Video as TikTok,
  PhoneCall as WhatsApp,
  Info,
  ShieldAlert,
  Users,
  Rss,
  Settings,
  ShieldCheck
} from 'lucide-react';

import { Position, TradeHistory, User, Course, Signal, SiteSettings } from './types';
import Auth from './components/Auth';
import AIMentor from './components/AIMentor';
import FeedWidget from './components/FeedWidget';

import Home from './pages/Home';
import Trading from './pages/Trading';
import Academy, { INITIAL_COURSES } from './pages/Academy';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import Signals, { INITIAL_SIGNALS } from './pages/Signals';
import Tools from './pages/Tools';
import About from './pages/About';
import Legal from './pages/Legal';
import Community from './pages/Community';
import Admin from './pages/Admin';

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "Earn with Rashid",
  logoText: "R",
  heroTitle: "Learn Trading the Right Way with Rashid",
  heroSubtitle: "Forex, Crypto, and Stocks ki dunya mein expert banein. Humara simulator aur AI analyzer aapki trading journey ko asaan banata hai.",
  announcement: "Professional grade trading education in simple Roman Urdu."
};

const BottomNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isAcademy = location.pathname.startsWith('/academy');
  
  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-zinc-800/50 z-[90] flex justify-around items-center py-2 px-4 pb-safe bg-zinc-950/95 backdrop-blur-2xl">
      <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <HomeIcon size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
      </Link>
      <Link to="/trading" className={`flex flex-col items-center gap-1 transition-all ${isActive('/trading') ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <BarChart2 size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Trade</span>
      </Link>
      
      {/* Academy Item */}
      <Link to="/academy" className="group -mt-6">
        <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 text-white shadow-blue-500/40 ${
          isAcademy ? 'ring-4 ring-blue-500/40 scale-110' : 'hover:scale-105'
        }`}>
          <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-50"></div>
          <BookOpen size={24} className="relative z-10" />
          <span className="text-[7px] font-black uppercase tracking-widest mt-0.5 relative z-10">Academy</span>
        </div>
      </Link>

      <Link to="/signals" className={`flex flex-col items-center gap-1 transition-all ${isActive('/signals') ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <Target size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Signals</span>
      </Link>

      <Link to="/dashboard" className={`flex flex-col items-center gap-1 transition-all ${isActive('/dashboard') ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <LayoutDashboard size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
      </Link>

      {isAdmin && (
        <Link to="/admin" className={`flex flex-col items-center gap-1 transition-all ${isActive('/admin') ? 'text-purple-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <Settings size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Admin</span>
        </Link>
      )}
    </div>
  );
};

const Header = ({ user, menuOpen, setMenuOpen, settings }: { user: User | null, menuOpen: boolean, setMenuOpen: (v: boolean) => void, settings: SiteSettings }) => {
  return (
    <header className="glass border-b border-zinc-800/50 p-4 sticky top-0 z-[80] flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic shadow-lg shadow-blue-900/20">{settings.logoText}</div>
          <span className="font-black text-sm tracking-tight hidden xs:block">{settings.brandName}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
         <Link to="/dashboard" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shadow-inner">
            {user?.profilePic ? (
              <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <UserIcon size={16} className="text-zinc-500" />
            )}
         </Link>
      </div>
    </header>
  );
};

const HamburgerMenu = ({ open, setOpen, onOpenFeed }: { open: boolean, setOpen: (v: boolean) => void, onOpenFeed: () => void }) => {
  if (!open) return null;
  
  const menuItems: { label: string; path?: string; onClick?: () => void; icon: any }[] = [
    { label: 'Community Page', path: '/community', icon: Users },
    { label: 'Tools & Calculators', path: '/tools', icon: BarChart2 },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Legal & Risk', path: '/legal', icon: ShieldAlert },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[80%] max-sm max-w-sm h-full bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col animate-in slide-in-from-left-4">
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic shadow-lg">R</div>
            <span className="font-black text-sm tracking-tight">Main Menu</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-2 flex-1">
          {menuItems.map((item, idx) => (
            item.path ? (
              <Link 
                key={idx} 
                to={item.path} 
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all text-zinc-400 hover:text-white group"
              >
                <item.icon size={20} className="group-hover:text-blue-500 transition-colors" />
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            ) : (
              <button 
                key={idx} 
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all text-zinc-400 hover:text-white group"
              >
                <item.icon size={20} className="group-hover:text-blue-500 transition-colors" />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            )
          ))}
        </div>

        <div className="pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Institutional Standard</p>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children, user, setUser, settings }: { children?: React.ReactNode, user: User | null, setUser: any, settings: SiteSettings }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 selection:bg-blue-500/30">
      <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} onOpenFeed={() => setFeedOpen(true)} />
      <main className="flex-1 overflow-y-auto pb-24 relative flex flex-col">
        <Header user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} settings={settings} />

        <div className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-grow">
          {children}
        </div>

        <footer className="w-full border-t border-zinc-800/50 p-10 flex flex-col items-center gap-10 mt-auto bg-zinc-950/80">
          <div className="flex flex-wrap justify-center gap-10">
            <a href="https://youtube.com/@earnwithrashid?si=oTdHehqC2LjgrN0b" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-red-500 transition-colors flex flex-col items-center gap-2">
               <Youtube size={24} />
               <span className="text-[9px] font-black uppercase tracking-widest">YouTube</span>
            </a>
            <a href="https://t.me/earnwithrashidchannel" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors flex flex-col items-center gap-2">
               <Telegram size={24} />
               <span className="text-[9px] font-black uppercase tracking-widest">Telegram</span>
            </a>
            <a href="https://tiktok.com/@EarnwithRashid" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors flex flex-col items-center gap-2">
               <TikTok size={24} />
               <span className="text-[9px] font-black uppercase tracking-widest">TikTok</span>
            </a>
            <a href="https://www.whatsapp.com/channel/0029Va82SRN7j6g15nRATy3d" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-green-500 transition-colors flex flex-col items-center gap-2">
               <WhatsApp size={24} />
               <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
            </a>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-zinc-400 text-sm font-medium">© Copyright <span className="text-zinc-100">{settings.brandName}</span> – All Rights Reserved</p>
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
               Developed by <span className="text-zinc-400">Hammad</span> — <a href="https://share.google/RLkRKerN1JwueeUgJ" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Clyro Tech Solutions</a>
            </div>
          </div>
        </footer>
      </main>

      <BottomNav isAdmin={user?.role === 'admin'} />
      <AIMentor />
      {user && <FeedWidget isOpen={feedOpen} setIsOpen={setFeedOpen} user={user} />}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('er_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('er_site_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('er_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [signals, setSignals] = useState<Signal[]>(() => {
    const saved = localStorage.getItem('er_signals');
    return saved ? JSON.parse(saved) : INITIAL_SIGNALS;
  });

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('er_balance');
    return saved ? parseFloat(saved) : 10000;
  });

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('er_positions');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<TradeHistory[]>(() => {
    const saved = localStorage.getItem('er_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('er_user', JSON.stringify(user));
      localStorage.setItem('er_balance', balance.toString());
      localStorage.setItem('er_positions', JSON.stringify(positions));
      localStorage.setItem('er_history', JSON.stringify(history));
      localStorage.setItem('er_site_settings', JSON.stringify(settings));
      localStorage.setItem('er_courses', JSON.stringify(courses));
      localStorage.setItem('er_signals', JSON.stringify(signals));
    }
  }, [balance, positions, history, user, settings, courses, signals]);

  if (!user) {
    return <Auth onAuth={setUser} />;
  }

  return (
    <Router>
      <Layout user={user} setUser={setUser} settings={settings}>
        <Routes>
          <Route path="/" element={<Home settings={settings} />} />
          <Route path="/trading" element={<Trading balance={balance} setBalance={setBalance} positions={positions} setPositions={setPositions} history={history} setHistory={setHistory} />} />
          <Route path="/academy" element={<Academy courses={courses} settings={settings} />} />
          <Route path="/academy/:courseId" element={<CourseDetail user={user} setUser={setUser} courses={courses} />} />
          <Route path="/dashboard" element={<Dashboard balance={balance} positions={positions} history={history} user={user} setUser={setUser} />} />
          <Route path="/community" element={<Community user={user} />} />
          <Route path="/signals" element={<Signals signals={signals} />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/admin" element={<Admin user={user} setSettings={setSettings} settings={settings} courses={courses} setCourses={setCourses} signals={signals} setSignals={setSignals} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
