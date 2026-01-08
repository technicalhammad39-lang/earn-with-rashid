
import React from 'react';
import { Signal } from '../types';
import { Target, TrendingUp, TrendingDown, Clock, Info, BrainCircuit, CheckCircle2, ShieldAlert } from 'lucide-react';

export const INITIAL_SIGNALS: Signal[] = [
  { 
    id: 's1', 
    pair: 'BTC/USDT', 
    type: 'BUY', 
    entry: '64,200', 
    tp: '67,500', 
    sl: '62,800', 
    confidence: 85, 
    timeframe: '4H', 
    status: 'Active',
    explanation: "Market ne support zone se rejection li hai aur 4H timeframe par bullish engulfing pattern ban raha hai. Yeh trend continuation ka ishara hai."
  }
];

const Signals = ({ signals }: { signals: Signal[] }) => {
  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Teacher Style Signals</h1>
          <p className="text-zinc-400">Rashid Ali Ali ki expert team se seekhein aur kamayein.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {signals.map(signal => (
          <div key={signal.id} className="glass rounded-3xl p-6 relative overflow-hidden group border-zinc-800/50 shadow-2xl flex flex-col">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 pointer-events-none transition-all duration-500 group-hover:opacity-20 ${signal.type === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-1">{signal.pair}</h3>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                  <Clock size={12} /> {signal.timeframe} TIMEFRAME
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${signal.type === 'BUY' ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-red-600 text-white shadow-red-900/20'}`}>
                {signal.type}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-inner">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Entry Zone</p>
                <p className="font-bold font-mono">{signal.entry}</p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-inner">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Confidence</p>
                <p className="font-bold text-blue-500">{signal.confidence}%</p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-inner">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Profit (TP)</p>
                <p className="font-bold text-green-500 font-mono">{signal.tp}</p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-inner">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Safeguard (SL)</p>
                <p className="font-bold text-red-500 font-mono">{signal.sl}</p>
              </div>
            </div>

            <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 mb-8 flex-1">
               <div className="flex items-center gap-2 mb-2 text-blue-500">
                 <BrainCircuit size={16} />
                 <p className="text-[10px] font-black uppercase tracking-widest">Mentor Analysis</p>
               </div>
               <p className="text-xs text-zinc-400 leading-relaxed italic">"{signal.explanation}"</p>
            </div>

            <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all group">
              View Chart Details <Target size={16} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Signals;
