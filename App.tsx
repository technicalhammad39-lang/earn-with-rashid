
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Settings,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';

import { Position, TradeHistory, User, Course, Signal, SiteSettings } from './types';
import Auth from './components/Auth';
import AIMentorWidget from './components/AIMentor';
import CommunityWidget from './components/CommunityWidget';

import Home from './pages/Home';
import Trading from './pages/Trading';
import Academy from './pages/Academy';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import Signals from './pages/Signals';
import Tools from './pages/Tools';
import About from './pages/About';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import CommunityPage from './pages/CommunityPage';
import MentorPage from './pages/MentorPage';

const LOGO_URL = "https://i.ibb.co/hR99H2Wv/logo-rashid.png";

export const INITIAL_SIGNALS: Signal[] = [
  { id: 's1', pair: 'BTC/USDT', type: 'BUY', market: 'Crypto', entry: '64,200', tp: '67,500', sl: '62,800', confidence: 85, timeframe: '4H', status: 'Active', explanation: "Bullish divergence on RSI and bounce from key demand zone." },
  { id: 's2', pair: 'EUR/USD', type: 'SELL', market: 'Forex', entry: '1.0850', tp: '1.0720', sl: '1.0910', confidence: 90, timeframe: '1H', status: 'Active', explanation: "Resistance rejection at psychological level 1.0900." },
  { id: 's3', pair: 'NVDA', type: 'BUY', market: 'Stocks', entry: '850.00', tp: '920.00', sl: '820.00', confidence: 88, timeframe: 'Daily', status: 'Active', explanation: "Strong earnings momentum and breaking out of a cup and handle pattern." },
  { id: 's4', pair: 'USD/JPY (1M)', type: 'BUY', market: 'Binary Options', entry: 'Call @ 151.20', tp: 'In The Money', sl: 'Out of Money', confidence: 92, timeframe: '1M', status: 'Active', explanation: "Quick scalping strategy: price rejected from lower Bollinger Band." }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-forex',
    title: 'Institutional Forex Mastery',
    description: 'Learn the secrets of the $7 trillion/day market. Master liquidity, order blocks, and session timing.',
    category: 'strategies',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1611974717482-48092895b9b8?auto=format&fit=crop&q=80&w=600',
    chapters: [{ id: 'ch1', title: 'FX Fundamentals', lessons: [{ id: 'l1', title: 'The SMC Method', content: 'Smart Money Concepts allow you to see where the big players are placing their orders.', image: '', videoUrl: '' }] }]
  },
  {
    id: 'c-crypto',
    title: 'Crypto Scalping Secrets',
    description: 'High volatility trading for high returns. Learn to trade BTC, ETH, and Altcoins using advanced volume analysis.',
    category: 'strategies',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=600',
    chapters: [{ id: 'ch1', title: 'Blockchain Analysis', lessons: [{ id: 'l1', title: 'Volume Spread Analysis', content: 'Using volume to confirm trend strength in crypto markets.', image: '', videoUrl: '' }] }]
  },
  {
    id: 'c-stocks',
    title: 'Stock Market Investing',
    description: 'Build a long-term portfolio and master day trading Blue Chip stocks like NVDA, AAPL, and TSLA.',
    category: 'basics',
    level: 'Beginner → Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    chapters: [{ id: 'ch1', title: 'Wall Street Basics', lessons: [{ id: 'l1', title: 'Reading Balance Sheets', content: 'Fundamentals are key for stock market success.', image: '', videoUrl: '' }] }]
  },
  {
    id: 'c-binary',
    title: 'Binary Options Pro Strategy',
    description: 'Master the 1-minute and 5-minute candle reactions. Precision entries for fixed-time trades.',
    category: 'strategies',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1560523132-801897e7260b?auto=format&fit=crop&q=80&w=600',
    chapters: [{ id: 'ch1', title: 'M1 Execution', lessons: [{ id: 'l1', title: 'Pin Bar Rejections', content: 'The bread and butter of binary options trading.', image: '', videoUrl: '' }] }]
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "Earn with Rashid",
  logoText: "R",
  logoUrl: LOGO_URL,
  heroTitle: "Learn Trading the Right Way with Rashid",
  heroSubtitle: "Forex, Crypto, Stocks, and Binary Options ki dunya mein expert banein. Humara simulator aur AI analyzer aapki trading journey ko asaan banata hai.",
  announcement: "Professional grade trading education in simple Roman Urdu."
};

const BottomNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
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
      
      <Link to="/academy" className={`flex flex-col items-center gap-1 transition-all ${isActive('/academy') ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <GraduationCap size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Learn</span>
      </Link>

      <Link to="/signals" className={`flex flex-col items-center gap-1 transition-all ${isActive('/signals') ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <Target size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Signals</span>
      </Link>

      <Link to="/dashboard" className={`flex flex-col items-center gap-1 transition-all ${isActive('/dashboard') ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <LayoutDashboard size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Status</span>
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
          <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover shadow-lg" />
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

const HamburgerMenu = ({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) => {
  if (!open) return null;
  const menuItems = [
    { label: 'Academy', path: '/academy', icon: BookOpen },
    { label: 'Community Hub', path: '/community', icon: Users },
    { label: 'Tools & Calculators', path: '/tools', icon: BarChart2 },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Legal & Risk', path: '/legal', icon: ShieldAlert },
  ];
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[80%] max-sm max-w-sm h-full bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col animate-in slide-in-from-left-4">
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-2">
            <img src={LOGO_URL} className="w-8 h-8 rounded" alt="Logo" />
            <span className="font-black text-sm tracking-tight">Main Menu</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-2 flex-1">
          {menuItems.map((item, idx) => (
            <Link key={idx} to={item.path} onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all text-zinc-400 hover:text-white group">
              <item.icon size={20} className="group-hover:text-blue-500 transition-colors" />
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
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
  const [positions, setPositions] = useState<Position[]>(() => JSON.parse(localStorage.getItem('er_positions') || '[]'));
  const [history, setHistory] = useState<TradeHistory[]>(() => JSON.parse(localStorage.getItem('er_history') || '[]'));
  const [menuOpen, setMenuOpen] = useState(false);

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

  if (!user) return <Auth onAuth={setUser} />;

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-zinc-950 selection:bg-blue-500/30">
        <HamburgerMenu open={menuOpen} setOpen={setMenuOpen} />
        <main className="flex-1 overflow-y-auto pb-24 relative flex flex-col">
          <Header user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} settings={settings} />
          <div className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-grow">
            <Routes>
              <Route path="/" element={<Home settings={settings} />} />
              <Route path="/trading" element={<Trading balance={balance} setBalance={setBalance} positions={positions} setPositions={setPositions} history={history} setHistory={setHistory} />} />
              <Route path="/academy" element={<Academy courses={courses} settings={settings} />} />
              <Route path="/academy/:courseId" element={<CourseDetail user={user} setUser={setUser} courses={courses} />} />
              <Route path="/dashboard" element={<Dashboard balance={balance} positions={positions} history={history} user={user} setUser={setUser} />} />
              <Route path="/signals" element={<Signals signals={signals} />} />
              <Route path="/community" element={<CommunityPage user={user} />} />
              <Route path="/mentor" element={<MentorPage />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/admin" element={<Admin user={user} setSettings={setSettings} settings={settings} courses={courses} setCourses={setCourses} signals={signals} setSignals={setSignals} />} />
            </Routes>
          </div>
          <footer className="w-full border-t border-zinc-800/50 p-10 flex flex-col items-center gap-10 mt-auto bg-zinc-950/80">
            <div className="flex flex-wrap justify-center gap-10">
              <a href="https://youtube.com/@earnwithrashid" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-red-500 flex flex-col items-center gap-2"><Youtube size={24} /><span className="text-[9px] font-black uppercase tracking-widest">YouTube</span></a>
              <a href="https://t.me/earnwithrashidchannel" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-blue-400 flex flex-col items-center gap-2"><Telegram size={24} /><span className="text-[9px] font-black uppercase tracking-widest">Telegram</span></a>
              <a href="https://tiktok.com/@EarnwithRashid" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white flex flex-col items-center gap-2"><TikTok size={24} /><span className="text-[9px] font-black uppercase tracking-widest">TikTok</span></a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-green-500 flex flex-col items-center gap-2"><WhatsApp size={24} /><span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span></a>
            </div>
            <p className="text-zinc-400 text-sm font-medium">© Copyright {settings.brandName} – All Rights Reserved</p>
          </footer>
        </main>
        
        {/* Floating Draggable Shortcut Icons (Link Only) */}
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <CommunityWidget />
          <AIMentorWidget />
        </div>

        <BottomNav isAdmin={user?.role === 'admin'} />
      </div>
    </Router>
  );
};

export default App;
