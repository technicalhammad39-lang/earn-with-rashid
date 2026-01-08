
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Position, TradeHistory, MarketPair } from '../types';
import { analyzeMarket } from '../services/gemini';
import { 
  TrendingUp, 
  Wallet, 
  BrainCircuit, 
  ChevronDown, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  History,
  Target,
  X,
  Search,
  Info
} from 'lucide-react';

declare const TradingView: any;

const PAIRS: MarketPair[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', type: 'Crypto', price: 65420.50, change: 2.5 },
  { symbol: 'ETHUSDT', name: 'Ethereum', type: 'Crypto', price: 3450.12, change: -1.2 },
  { symbol: 'SOLUSDT', name: 'Solana', type: 'Crypto', price: 145.40, change: 4.8 },
  { symbol: 'XRPUSDT', name: 'XRP', type: 'Crypto', price: 0.62, change: 1.1 },
  { symbol: 'EURUSD', name: 'EUR / USD', type: 'Forex', price: 1.0850, change: 0.05 },
  { symbol: 'GBPUSD', name: 'GBP / USD', type: 'Forex', price: 1.2640, change: -0.12 },
  { symbol: 'GOLD', name: 'Gold / USD', type: 'Forex', price: 2345.80, change: 0.35 },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stocks', price: 185.92, change: 0.8 },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stocks', price: 178.50, change: -2.4 },
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
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(
    PAIRS.reduce((acc, p) => ({ ...acc, [p.symbol]: p.price }), {})
  );

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  // Chart initialization
  useEffect(() => {
    let isActive = true;
    let checkInterval: any = null;

    const createWidget = () => {
      if (!isActive || !chartContainerRef.current || typeof TradingView === 'undefined') return;
      if (chartContainerRef.current) chartContainerRef.current.innerHTML = '';

      try {
        widgetRef.current = new TradingView.widget({
          "autosize": true,
          "symbol": selectedPair.symbol,
          "interval": "60",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#09090b",
          "enable_publishing": false,
          "hide_side_toolbar": true,
          "allow_symbol_change": false,
          "container_id": chartContainerRef.current.id,
          "backgroundColor": "#09090b",
          "gridColor": "rgba(255, 255, 255, 0.05)",
          "disabled_features": ["header_compare", "header_saveload", "header_settings", "header_undo_redo", "header_screenshot", "header_symbol_search"],
          "enabled_features": ["header_indicators"],
          "library_path": "https://s3.tradingview.com/tv.js"
        });
        setIsChartReady(true);
      } catch (err) {
        console.error("TradingView Widget fail:", err);
      }
    };

    if (typeof TradingView !== 'undefined') {
      createWidget();
    } else {
      checkInterval = setInterval(() => {
        if (typeof TradingView !== 'undefined') {
          createWidget();
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      isActive = false;
      if (checkInterval) clearInterval(checkInterval);
      setIsChartReady(false);
    };
  }, [selectedPair.symbol]);

  // Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrices(prev => {
        const next = { ...prev };
        PAIRS.forEach(p => {
          const move = (Math.random() - 0.5) * (next[p.symbol] * 0.0006);
          next[p.symbol] = parseFloat((next[p.symbol] + move).toFixed(p.symbol.includes('USD') && !p.symbol.includes('USDT') ? 4 : 2));
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // SL/TP Liquidation logic
  const closePosition = useCallback((pos: Position, exitType: 'Manual' | 'SL' | 'TP' = 'Manual') => {
    const currentPrice = currentPrices[pos.symbol];
    if (!currentPrice) return;
    
    const diff = pos.type === 'Long' 
      ? (currentPrice - pos.entryPrice) / pos.entryPrice 
      : (pos.entryPrice - currentPrice) / pos.entryPrice;
    
    const pnl = pos.amount * diff * pos.leverage;
    const finalReturn = pos.amount + pnl;

    const trade: TradeHistory = {
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
    };

    setHistory(prev => [trade, ...prev]);
    setPositions(prev => prev.filter(p => p.id !== pos.id));
    setBalance(prev => prev + (finalReturn < 0 ? 0 : finalReturn));
  }, [currentPrices, setHistory, setPositions, setBalance]);

  useEffect(() => {
    positions.forEach(pos => {
      const price = currentPrices[pos.symbol];
      if (!price) return;

      let triggered = false;
      let exitType: 'SL' | 'TP' = 'SL';

      if (pos.type === 'Long') {
        if (pos.sl && price <= pos.sl) { triggered = true; exitType = 'SL'; }
        if (pos.tp && price >= pos.tp) { triggered = true; exitType = 'TP'; }
      } else {
        if (pos.sl && price >= pos.sl) { triggered = true; exitType = 'SL'; }
        if (pos.tp && price <= pos.tp) { triggered = true; exitType = 'TP'; }
      }

      if (triggered) {
        closePosition(pos, exitType);
      }
    });
  }, [currentPrices, positions, closePosition]);

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
    try {
      const result = await analyzeMarket(selectedPair.symbol, selectedPair.type);
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
      setAiAnalysis({ rating: 'Error', explanationUrdu: 'Failed to connect' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Top Simplified Actions */}
      <div className="flex items-center gap-4">
         <button 
           onClick={() => setShowPairSelector(true)}
           className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between hover:border-blue-500 transition-all shadow-xl"
         >
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                  <TrendingUp size={20} />
               </div>
               <div className="text-left">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Selected Instrument</p>
                  <p className="text-sm font-black">{selectedPair.symbol}</p>
               </div>
            </div>
            <ChevronDown size={14} className="text-zinc-500" />
         </button>

         <button 
           onClick={fetchAIAnalysis}
           className="w-16 h-16 sm:w-auto sm:px-8 bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/30 active:scale-95 group"
         >
            <BrainCircuit size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em]">Rashid AI Analyzer</span>
         </button>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 glass rounded-3xl overflow-hidden min-h-[520px] border-zinc-800 relative bg-zinc-950 shadow-2xl">
          {!isChartReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 bg-zinc-950">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Syncing Terminal...</p>
            </div>
          )}
          <div id="tv_chart_container" ref={chartContainerRef} className="w-full h-[520px]" />
        </div>

        {/* Trade Panel */}
        <div className="lg:col-span-4 space-y-4">
           <div className="glass p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-zinc-950 border-blue-500/20 shadow-xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1 tracking-widest mb-1"><Wallet size={12}/> Paper Trading Equity</p>
              <p className="text-3xl font-bold tracking-tight font-mono">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
           </div>

           <div className="glass p-6 rounded-3xl space-y-5 border-zinc-800 shadow-xl">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                   <span>Order Margin (USDT)</span>
                   <button onClick={() => setAmount(Math.floor(balance))} className="text-blue-500 hover:text-blue-400">MAX</button>
                </div>
                <input 
                  type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Stop Loss (SL)</p>
                   <input 
                    type="number" value={sl} onChange={e => setSl(e.target.value)} placeholder="0.00"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 outline-none focus:border-red-500 text-xs font-mono"
                   />
                </div>
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Take Profit (TP)</p>
                   <input 
                    type="number" value={tp} onChange={e => setTp(e.target.value)} placeholder="0.00"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 outline-none focus:border-green-500 text-xs font-mono"
                   />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <span>Multiplier: {leverage}x</span>
                </div>
                <input 
                  type="range" min="1" max="100" value={leverage} onChange={e => setLeverage(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => handleOpenPosition('Long')} className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex flex-col items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-80">BUY</span>
                   <span className="text-lg">Long</span>
                </button>
                <button onClick={() => handleOpenPosition('Short')} className="py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex flex-col items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-80">SELL</span>
                   <span className="text-lg">Short</span>
                </button>
              </div>
           </div>
        </div>
      </div>
      {/* ... rest of component ... */}
    </div>
  );
};

export default Trading;
