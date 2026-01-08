
import React, { useState } from 'react';
import { Calculator, Calendar, Newspaper, TrendingUp, DollarSign, Percent } from 'lucide-react';

const Tools = () => {
  const [pnlInput, setPnlInput] = useState({ entry: '', exit: '', amount: '', leverage: '1' });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const calculatePnL = () => {
    const { entry, exit, amount, leverage } = pnlInput;
    const diff = (parseFloat(exit) - parseFloat(entry)) / parseFloat(entry);
    const result = parseFloat(amount) * diff * parseFloat(leverage);
    setCalcResult(result);
  };

  return (
    <div className="space-y-10 py-6">
      <div>
        <h1 className="text-3xl font-extrabold mb-1">Trader's Toolkit</h1>
        <p className="text-zinc-400">Zaruri calculators aur tools aapki behtri ke liye.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* PnL Calculator */}
        <div className="glass rounded-3xl p-8 border-l-4 border-blue-600">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="text-blue-500" /> Profit/Loss Calculator
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 font-bold uppercase mb-2 block">Entry Price</label>
                <input 
                  type="number"
                  placeholder="e.g. 64200"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  value={pnlInput.entry}
                  onChange={e => setPnlInput({...pnlInput, entry: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 font-bold uppercase mb-2 block">Exit Price</label>
                <input 
                  type="number"
                  placeholder="e.g. 66000"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  value={pnlInput.exit}
                  onChange={e => setPnlInput({...pnlInput, exit: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 font-bold uppercase mb-2 block">Investment (USDT)</label>
                <input 
                  type="number"
                  placeholder="e.g. 100"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  value={pnlInput.amount}
                  onChange={e => setPnlInput({...pnlInput, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 font-bold uppercase mb-2 block">Leverage</label>
                <input 
                  type="number"
                  placeholder="e.g. 10"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  value={pnlInput.leverage}
                  onChange={e => setPnlInput({...pnlInput, leverage: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={calculatePnL}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
            >
              Calculate P/L
            </button>

            {calcResult !== null && (
              <div className="mt-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Expected Result</p>
                <p className={`text-3xl font-bold ${calcResult >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {calcResult >= 0 ? '+' : ''}${calcResult.toFixed(2)}
                </p>
                <p className="text-xs text-zinc-400 mt-2">({((calcResult/parseFloat(pnlInput.amount))*100).toFixed(1)}% Return on Equity)</p>
              </div>
            )}
          </div>
        </div>

        {/* Economic Calendar Placeholder */}
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="text-blue-500" /> Economic Calendar
            </h3>
            <span className="px-2 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded">LIVE FEED</span>
          </div>
          <div className="space-y-4">
             {[
               { time: '14:30', currency: 'USD', event: 'CPI m/m', impact: 'High' },
               { time: '16:00', currency: 'EUR', event: 'German Ifo Business Climate', impact: 'Medium' },
               { time: '18:15', currency: 'GBP', event: 'BoE Gov Bailey Speaks', impact: 'High' },
               { time: '21:00', currency: 'USD', event: 'FOMC Meeting Minutes', impact: 'High' },
             ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors">
                  <div className="text-sm font-bold text-zinc-300">{item.time}</div>
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded font-bold text-zinc-400">{item.currency}</span>
                        <p className="text-sm font-medium">{item.event}</p>
                     </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${item.impact === 'High' ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-orange-500 shadow-sm shadow-orange-500'}`}></div>
               </div>
             ))}
             <button className="w-full mt-4 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors">
               View Full Calendar
             </button>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="glass rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Newspaper className="text-blue-500" /> Market Insights
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: 'Bitcoin nears all-time high as ETFs see massive inflows', source: 'CryptoNews', date: '2h ago', image: 'https://picsum.photos/seed/news1/300/200' },
             { title: 'FED signals potential rate cuts by late 2024', source: 'FinTech Daily', date: '4h ago', image: 'https://picsum.photos/seed/news2/300/200' },
             { title: 'Nvidia stock hits new record following AI hype', source: 'StockWatch', date: '5h ago', image: 'https://picsum.photos/seed/news3/300/200' },
           ].map((news, idx) => (
             <div key={idx} className="rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group">
                <div className="aspect-video overflow-hidden">
                   <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={news.title} />
                </div>
                <div className="p-4">
                   <p className="text-[10px] font-bold text-blue-500 uppercase mb-2 flex items-center justify-between">
                     {news.source} <span>{news.date}</span>
                   </p>
                   <h4 className="text-sm font-bold leading-tight group-hover:text-blue-400 transition-colors">{news.title}</h4>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
