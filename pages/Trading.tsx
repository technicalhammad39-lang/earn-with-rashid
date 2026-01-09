
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Position, TradeHistory, MarketPair } from '../types';
import { analyzeMarket } from '../services/gemini';
import { 
  TrendingUp, 
  Wallet, 
  BrainCircuit, 
  ChevronDown, 
  Loader2,
  Target,
  X,
  ShieldCheck,
  Zap,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

declare const TradingView: any;

const PAIRS: MarketPair[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', type: 'Crypto', price: 65420.50, change: 2.5 },
  { symbol: 'ETHUSDT', name: 'Ethereum', type: 'Crypto', price: 3450.12, change: -1.2 },
  { symbol: 'EURUSD', name: 'EUR / USD', type: 'Forex', price: 1.0850, change: 0.05 },
  { symbol: 'GOLD', name: 'Gold / USD', type: 'Forex', price: 2345.80, change: 0.35 },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stocks', price: 185.92, change: 0.8 },
];

interface TradingProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  positions: Position[];
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
  history: TradeHistory[];
  setHistory: React.Dispatch<React.SetStateAction<TradeHistory[]>>;
}

const Trading: React.FC<TradingProps> = ({ balance, setBalance, positions, setPositions, history, setHistory }) => {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [amount, setAmount] = useState(100);
  const [leverage, setLeverage] = useState(10);
  const [sl, setSl] = useState<string>('');
  const [tp, setTp] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isChartReady, setIsChartReady] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(
    PAIRS.reduce((acc, p) => ({ ...acc, [p.symbol]: p.price }), {})
  );

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    let isActive = true;
    const createWidget = () => {
      if (!isActive || !chartContainerRef.current || typeof TradingView === 'undefined') return;
      if (chartContainerRef.current) chartContainerRef.current.innerHTML = '';
      try {
        widgetRef.current = new TradingView.widget({
          "autosize": true,
          "symbol": selectedPair.symbol,
          "interval": "60",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#09090b",
          "container_id": chartContainerRef.current.id,
          "backgroundColor": "#09090b",
          "gridColor": "rgba(255, 255, 255, 0.05)",
          "hide_side_toolbar": true,
        });
        setIsChartReady(true);
      } catch (err) { console.error(err); }
    };
    createWidget();
    return () => { isActive = false; setIsChartReady(false); };
  }, [selectedPair.symbol]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrices(prev => {
        const next = { ...prev };
        PAIRS.forEach(p => {
          const move = (Math.random() - 0.5) * (next[p.symbol] * 0.0006);
          next[p.symbol] = parseFloat((next[p.symbol] + move).toFixed(2));
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleOpenPosition = (type: 'Long' | 'Short') => {
    if (amount <= 0 || amount > balance) return alert("Invalid amount or insufficient balance.");
    const newPosition: Position = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: selectedPair.symbol,
      type,
      entryPrice: currentPrices[selectedPair.symbol],
      amount,
      leverage,
      sl: sl ? parseFloat(sl) : undefined,
      tp: tp ? parseFloat(tp) : undefined,
      timestamp: Date.now(),
    };
    setPositions(prev => [newPosition, ...prev]);
    setBalance(prev => prev - amount);
    setSl(''); setTp('');
  };

  const fetchAIAnalysis = async () => {
    setAnalyzing(true);
    setShowAiModal(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeMarket(selectedPair.symbol, selectedPair.type);
      setAiAnalysis(result);
    } catch (e) {
      setAiAnalysis({ rating: 'Error', explanationUrdu: 'Connection failed.' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
         <div className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500"><TrendingUp size={20} /></div>
               <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Pair</p>
                  <p className="text-sm font-black">{selectedPair.symbol}</p>
               </div>
            </div>
         </div>
         <button onClick={fetchAIAnalysis} className="px-8 py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/30 active:scale-95 group">
            <BrainCircuit size={24} />
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em]">Rashid AI Analyzer</span>
         </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass rounded-3xl overflow-hidden min-h-[520px] border-zinc-800 relative bg-zinc-950 shadow-2xl">
          {!isChartReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 bg-zinc-950">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Loading Terminal...</p>
            </div>
          )}
          <div id="tv_chart_container" ref={chartContainerRef} className="w-full h-[520px]" />
        </div>

        <div className="lg:col-span-4 space-y-4">
           <div className="glass p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-zinc-950 border-blue-500/20 shadow-xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Available Equity</p>
              <p className="text-3xl font-bold tracking-tight font-mono">${balance.toLocaleString()}</p>
           </div>
           <div className="glass p-6 rounded-3xl space-y-5 border-zinc-800 shadow-xl">
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold" placeholder="Margin" />
              <div className="grid grid-cols-2 gap-4">
                 <input type="number" value={sl} onChange={e => setSl(e.target.value)} placeholder="SL" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 outline-none focus:border-red-500 text-xs" />
                 <input type="number" value={tp} onChange={e => setTp(e.target.value)} placeholder="TP" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 outline-none focus:border-green-500 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleOpenPosition('Long')} className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">Long</button>
                <button onClick={() => handleOpenPosition('Short')} className="py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">Short</button>
              </div>
           </div>
        </div>
      </div>

      {showAiModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl glass rounded-[2.5rem] border-zinc-800 p-0 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="p-8 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-900/40">
                      <BrainCircuit size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black uppercase tracking-tight">AI Analyzer</h2>
                      <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">Max Accuracy Logic</p>
                   </div>
                </div>
                <button onClick={() => setShowAiModal(false)} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all"><X size={20}/></button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
                {analyzing ? (
                   <div className="py-12 flex flex-col items-center justify-center gap-6">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                        <BrainCircuit size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
                      </div>
                      <div className="space-y-3 text-center">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Scanning Market Structure...</p>
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 animate-pulse">Calculating High-Accuracy Entry...</p>
                      </div>
                   </div>
                ) : aiAnalysis && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                     {/* Accuracy & Rating Grid */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                           <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Mentor Rating</p>
                           <p className={`text-xl font-black ${aiAnalysis.rating?.includes('Buy') ? 'text-green-500' : 'text-red-500'}`}>{aiAnalysis.rating}</p>
                        </div>
                        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                           <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Confidence</p>
                           <p className="text-xl font-black text-blue-500">{aiAnalysis.confidence}%</p>
                        </div>
                     </div>

                     {/* Levels Grid */}
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-5 bg-blue-600/5 rounded-3xl border border-blue-500/10">
                           <p className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest"><Target size={12}/> Entry Zone</p>
                           <p className="font-bold text-sm text-zinc-100 font-mono">{aiAnalysis.entryZone}</p>
                        </div>
                        <div className="space-y-2 p-5 bg-green-600/5 rounded-3xl border border-green-500/10">
                           <p className="text-[9px] font-black text-green-500 uppercase flex items-center gap-2 tracking-widest"><Zap size={12}/> Target Levels</p>
                           <p className="font-bold text-sm text-zinc-100 font-mono">{aiAnalysis.targets}</p>
                        </div>
                     </div>

                     {/* Urdu Explanation */}
                     <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-[2rem] space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-blue-600"></div>
                        <div className="flex items-center gap-2 text-blue-500">
                           <ShieldCheck size={18} />
                           <p className="text-[9px] font-black uppercase tracking-widest">Mentor Logic (Short & Precise)</p>
                        </div>
                        <p className="text-[13px] text-zinc-300 leading-relaxed font-medium italic">"{aiAnalysis.explanationUrdu}"</p>
                     </div>

                     <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-3">
                        <ShieldAlert size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">This analysis is based on Rashid's institutional models. Always use stop loss in live trading.</p>
                     </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-zinc-950/80 border-t border-zinc-800 shrink-0">
                 <button onClick={() => setShowAiModal(false)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]">
                    Confirm Logic
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Trading;
