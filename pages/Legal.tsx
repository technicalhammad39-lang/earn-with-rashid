
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, FileText, Lock, Info, AlertTriangle } from 'lucide-react';

const Legal = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const section = useMemo(() => new URLSearchParams(search).get('sec') || 'disclaimer', [search]);

  const handleSectionChange = (id: string) => {
    navigate(`/legal?sec=${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sticky Nav */}
        <div className="w-full md:w-64 glass rounded-3xl p-4 border-zinc-800/50 space-y-1 sticky top-24">
          {[
            { id: 'disclaimer', label: 'Risk Disclosure', icon: ShieldAlert },
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleSectionChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                section === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass rounded-3xl p-8 md:p-12 border-zinc-800/50 min-h-[600px] shadow-2xl">
          {section === 'disclaimer' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 text-red-500 mb-6">
                <AlertTriangle size={32} />
                <h1 className="text-3xl font-black tracking-tight">HIGH RISK DISCLOSURE</h1>
              </div>
              
              <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed space-y-6">
                <p className="text-zinc-200 font-bold bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
                  Trading involves substantial risk of loss and is not suitable for everyone. Past performance is not indicative of future results.
                </p>
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">No Financial Advice</h3>
                  <p>
                    The information provided by Earn with Rashid, including but not limited to trade signals, AI analysis, and educational materials, is for educational purposes only. It should not be considered as professional financial or investment advice.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">Individual Responsibility</h3>
                  <p>
                    You are solely responsible for any investment decisions you make. Trading in Forex, Crypto, and Stocks involves the risk of losing your entire capital. Never trade with money you cannot afford to lose.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">Signals & AI Accuracy</h3>
                  <p>
                    While our team and AI strive for maximum accuracy, we do not guarantee the success of any signal or analysis. Market conditions are highly volatile and can change instantly.
                  </p>
                </section>
              </div>
            </div>
          )}

          {section === 'terms' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <h1 className="text-3xl font-black tracking-tight mb-8">TERMS & CONDITIONS</h1>
              <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed space-y-6">
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">1. Acceptance of Terms</h3>
                  <p>
                    By accessing Earn with Rashid, you agree to comply with these Terms of Service and all applicable laws and regulations.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">2. Educational Use</h3>
                  <p>
                    The platform is strictly for educational and training purposes. Users are provided with a simulator to practice without financial risk. Using the signals on real accounts is at the user's own discretion and risk.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">3. Intellectual Property</h3>
                  <p>
                    All content, including courses, strategies, and software, is the property of Earn with Rashid and Clyro Tech. Unauthorized distribution or copying is prohibited.
                  </p>
                </section>
              </div>
            </div>
          )}

          {section === 'privacy' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <h1 className="text-3xl font-black tracking-tight mb-8">PRIVACY POLICY</h1>
              <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed space-y-6">
                <p>
                  At Earn with Rashid, we value your privacy and security. This policy outlines how we handle your data.
                </p>
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">Data Collection</h3>
                  <p>
                    We collect minimal information necessary for account management and simulator progress. We do not sell your personal information to third parties.
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">Security</h3>
                  <p>
                    We use industry-standard encryption to protect your data. However, no system is 100% secure, and we recommend using strong, unique passwords.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Legal;
