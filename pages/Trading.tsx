
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ShieldAlert,
  Edit3,
  CheckCircle,
  History,
  Trash2
} from 'lucide-react';

declare const TradingView: any;

const PAIRS: MarketPair[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', type: 'Crypto', price: 65420.50, change: 2.5 },
  { symbol: 'ETHUSDT', name: 'Ethereum', type: 'Crypto', price: 3450.12, change: -1.2 },
  { symbol: 'EURUSD', name: 'EUR / USD', type: 'Forex', price: 1.0850, change: 0.05 },
  { symbol: 'GOLD', name: 'Gold / USD', type: 'Forex', price: 2345.80, change: 0.35 },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stocks', price: 185.92, change: 0.8 },
  { symbol: 'NVDA', name: 'Nvidia', type: 'Stocks', price: 920.45, change: 1.5 },
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
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(
    PAIRS.reduce((acc, p) => ({ ...acc, [p.symbol]: p.price }), {})
  );

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  // Simulation Engine: Updates prices every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(symbol => {
          const move = (Math.random() - 0.5) * (next[symbol] * 0.0004);
          next[symbol] = parseFloat((next[symbol] + move).toFixed(selectedPair.type === 'Forex' ? 4 : 2));
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedPair.type]);

  // TP/SL and Real-time Logic Engine
  useEffect(() => {
    const interval = setInterval(() => {
      const closedPositions: TradeHistory[] = [];
      const remainingPositions: Position[] = [];

      positions.forEach(pos => {
        const currentPrice = currentPrices[pos.symbol];
        if (!currentPrice) {
          remainingPositions.push(pos);
          return;
        }

        let isClosed = false;
        let exitType: 'SL' | 'TP' | 'Manual' = 'Manual';

        // Check SL
        if (pos.sl) {
          if ((pos.type === 'Long' && currentPrice <= pos.sl) || (pos.type === 'Short' && currentPrice >= pos.sl)) {
            isClosed = true;
            exitType = 'SL';
          }
        }
        // Check TP
        if (pos.tp) {
          if ((pos.type === 'Long' && currentPrice >= pos.tp) || (pos.type === 'Short' && currentPrice <= pos.tp)) {
            isClosed = true;
            exitType = 'TP';
          }
        }

        if (isClosed) {
          const pnlFactor = pos.type === 'Long' ? (currentPrice - pos.entryPrice) / pos.entryPrice : (pos.entryPrice - currentPrice) / pos.entryPrice;
          const pnl = pos.amount * pnlFactor * pos.leverage;
          
          closedPositions.push({
            id: pos.id,
            symbol: pos.symbol,
            type: pos.type,
            entryPrice: pos.entryPrice,
            exitPrice: currentPrice,
            amount: pos.amount,
            leverage: pos.leverage,
            pnl,
            timestamp: Date.now(),
            exitType
          });
          setBalance(prev => prev + pos.amount + pnl);
        } else {
          remainingPositions.push(pos);
        }
      });

      if (closedPositions.length > 0) {
        setPositions(remainingPositions);
        setHistory(prev => [...closedPositions, ...prev]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [positions, currentPrices, setBalance, setHistory, setPositions]);

  // TradingView Integration
  useEffect(() => {
    let isActive = true;
    if (chartContainerRef.current) chartContainerRef.current.innerHTML = '';
    const createWidget = () => {
      if (!isActive || !chartContainerRef.current || typeof TradingView === 'undefined') return;
      try {
        widgetRef.current = new TradingView.widget({
          "autosize": true,
          "symbol": selectedPair.symbol,
          "interval": "15",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#09090b",
          "container_id": chartContainerRef.current.id,
          "backgroundColor": "#09090b",
          "gridColor": "rgba(255, 255, 255, 0.05)",
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "calendar": true,
        });
        setIsChartReady(true);
      } catch (err) { console.error(err); }
    };
    createWidget();
    return () => { isActive = false; setIsChartReady(false); };
  }, [selectedPair.symbol]);

  const handleOpenPosition = (type: 'Long' | 'Short') => {
    if (amount <= 0 || amount > balance) return alert("Invalid amount or insufficient balance.");
    const price = currentPrices[selectedPair.symbol];
    const newPosition: Position = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: selectedPair.symbol,
      type,
      entryPrice: price,
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

  const handleManualClose = (pos: Position) => {
    const currentPrice = currentPrices[pos.symbol];
    const pnlFactor = pos.type === 'Long' ? (currentPrice - pos.entryPrice) / pos.entryPrice : (pos.entryPrice - currentPrice) / pos.entryPrice;
    const pnl = pos.amount * pnlFactor * pos.leverage;
    
    setHistory(prev => [{
      id: pos.id,
      symbol: pos.symbol,
      type: pos.type,
      entryPrice: pos.entryPrice,
      exitPrice: currentPrice,
      amount: pos.amount,
      leverage: pos.leverage,
      pnl,
      timestamp: Date.now(),
      exitType: 'Manual'
    }, ...prev]);
    
    setPositions(prev => prev.filter(p => p.id !== pos.id));
    setBalance(prev => prev + pos.amount + pnl);
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
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
         <div className="flex-1 w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth">
               {PAIRS.map(p => (
                 <button 
                  key={p.symbol} 
                  onClick={() => setSelectedPair(p)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedPair.symbol === p.symbol ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   {p.symbol}
                 </button>
               ))}
            </div>
         </div>
         <button onClick={fetchAIAnalysis} className="w-full md:w-auto px-8 py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/30 active:scale-95 group">
            <BrainCircuit size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Rashid AI Analyzer</span>
         </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Terminal Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="glass rounded-[2rem] overflow-hidden min-h-[500px] border-zinc-800 relative bg-zinc-950 shadow-2xl">
            {!isChartReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 bg-zinc-950">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Syncing Terminal...</p>
              </div>
            )}
            <div id="tv_chart_container" ref={chartContainerRef} className="w-full h-[500px]" />
          </div>

          {/* Trades & History Management */}
          <div className="glass rounded-[2rem] border-zinc-800 overflow-hidden shadow-2xl bg-zinc-950/40">
            <div className="flex bg-zinc-900/50 p-2 border-b border-zinc-800">
               <button onClick={() => setActiveTab('positions')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'positions' ? 'bg-zinc-800 text-blue-500 shadow-inner' : 'text-zinc-500'}`}>
                 <Zap size={14} /> Active Trades ({positions.length})
               </button>
               <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-zinc-800 text-blue-500 shadow-inner' : 'text-zinc-500'}`}>
                 <History size={14} /> Trade History
               </button>
            </div>

            <div className="min-h-[300px] max-h-[500px] overflow-y-auto no-scrollbar">
               {activeTab === 'positions' ? (
                 <div className="p-4 space-y-3">
                    {positions.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-zinc-800">
                        <TrendingUp size={48} className="opacity-20 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-20">No Active Positions</p>
                      </div>
                    ) : (
                      positions.map(pos => {
                        const currentPrice = currentPrices[pos.symbol] || pos.entryPrice;
                        const pnlFactor = pos.type === 'Long' ? (currentPrice - pos.entryPrice) / pos.entryPrice : (pos.entryPrice - currentPrice) / pos.entryPrice;
                        const pnl = pos.amount * pnlFactor * pos.leverage;
                        const pnlPercent = (pnl / pos.amount) * 100;

                        return (
                          <div key={pos.id} className="glass p-5 rounded-2xl border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${pos.type === 'Long' ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-500'}`}>
                                   {pos.type === 'Long' ? 'B' : 'S'}
                                </div>
                                <div>
                                   <h4 className="font-black text-sm">{pos.symbol} <span className="text-zinc-600 ml-1">x{pos.leverage}</span></h4>
                                   <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Entry: ${pos.entryPrice.toLocaleString()}</p>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                                <div>
                                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Live Price</p>
                                   <p className="text-xs font-mono font-bold">${currentPrice.toLocaleString()}</p>
                                </div>
                                <div>
                                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Profit/Loss</p>
                                   <p className={`text-xs font-mono font-black ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent.toFixed(1)}%)
                                   </p>
                                </div>
                                <div>
                                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Take Profit</p>
                                   <p className="text-xs font-mono font-bold text-green-600/70">{pos.tp ? `$${pos.tp.toLocaleString()}` : '--'}</p>
                                </div>
                                <div>
                                   <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Stop Loss</p>
                                   <p className="text-xs font-mono font-bold text-red-600/70">{pos.sl ? `$${pos.sl.toLocaleString()}` : '--'}</p>
                                </div>
                             </div>

                             <button onClick={() => handleManualClose(pos)} className="px-6 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-red-500/20 active:scale-95">
                                Close Trade
                             </button>
                          </div>
                        );
                      })
                    )}
                 </div>
               ) : (
                 <div className="p-4 space-y-2">
                    {history.length === 0 ? (
                       <div className="py-20 flex flex-col items-center justify-center text-zinc-800">
                        <History size={48} className="opacity-20 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-20">No Trade Records</p>
                      </div>
                    ) : (
                      history.map(h => (
                        <div key={h.id} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50 hover:bg-zinc-900/50 transition-all">
                           <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-black ${h.type === 'Long' ? 'text-green-500' : 'text-red-500'}`}>{h.type.toUpperCase()}</span>
                              <span className="font-bold text-sm">{h.symbol}</span>
                           </div>
                           <div className="flex items-center gap-8">
                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{h.exitType}</span>
                              <span className={`text-xs font-mono font-black ${h.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                 {h.pnl >= 0 ? '+' : ''}${h.pnl.toFixed(2)}
                              </span>
                              <span className="text-[9px] text-zinc-700 font-black uppercase">{new Date(h.timestamp).toLocaleDateString()}</span>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Trading Sidebar Controls */}
        <div className="lg:col-span-3 space-y-4">
           <div className="glass p-6 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-zinc-950 border-blue-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Available Equity</p>
                <CheckCircle size={14} className="text-green-500" />
              </div>
              <p className="text-3xl font-black tracking-tight font-mono text-white">${balance.toLocaleString()}</p>
           </div>

           <div className="glass p-6 rounded-[2rem] space-y-6 border-zinc-800 shadow-xl bg-zinc-950">
              <div className="space-y-4">
                <div>
                   <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Margin (USDT)</label>
                   <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 outline-none focus:border-blue-500 font-black text-white text-lg" />
                </div>
                <div>
                   <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Leverage: {leverage}x</label>
                   <input type="range" min="1" max="125" value={leverage} onChange={e => setLeverage(Number(e.target.value))} className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Take Profit</label>
                      <input type="number" value={tp} onChange={e => setTp(e.target.value)} placeholder="Target" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-green-500 text-xs font-mono" />
                   </div>
                   <div>
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 block">Stop Loss</label>
                      <input type="number" value={sl} onChange={e => setSl(e.target.value)} placeholder="Risk" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-red-500 text-xs font-mono" />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => handleOpenPosition('Long')} className="py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-900/20 active:scale-95">Buy Long</button>
                <button onClick={() => handleOpenPosition('Short')} className="py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-900/20 active:scale-95">Sell Short</button>
              </div>

              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                 <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">
                    Institutional price simulation is active. Practice institutional logic on live-synced charts.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* AI Modal (Already enhanced in previous turn) */}
      {showAiModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl glass rounded-[2.5rem] border-zinc-800 p-0 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-8 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                      <BrainCircuit size={24} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black uppercase tracking-tight">AI Analyzer</h2>
                      <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">Max Accuracy Logic</p>
                   </div>
                </div>
                <button onClick={() => setShowAiModal(false)} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
                {analyzing ? (
                   <div className="py-12 flex flex-col items-center justify-center gap-6">
                      <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Scanning Market Structure...</p>
                   </div>
                ) : aiAnalysis && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
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
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-5 bg-blue-600/5 rounded-3xl border border-blue-500/10">
                           <p className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-2 tracking-widest"><Target size={12}/> Entry Zone</p>
                           <p className="font-bold text-sm text-zinc-100 font-mono">{aiAnalysis.entryZone}</p>
                        </div>
                        <div className="p-5 bg-green-600/5 rounded-3xl border border-green-500/10">
                           <p className="text-[9px] font-black text-green-500 uppercase flex items-center gap-2 tracking-widest"><Zap size={12}/> Target Levels</p>
                           <p className="font-bold text-sm text-zinc-100 font-mono">{aiAnalysis.targets}</p>
                        </div>
                     </div>
                     <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-[2rem] space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-blue-600"></div>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Mentor Logic (Roman Urdu)</p>
                        <p className="text-[13px] text-zinc-300 leading-relaxed font-medium italic">"{aiAnalysis.explanationUrdu}"</p>
                     </div>
                  </div>
                )}
              </div>
              <div className="p-6 bg-zinc-950/80 border-t border-zinc-800">
                 <button onClick={() => setShowAiModal(false)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">
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
