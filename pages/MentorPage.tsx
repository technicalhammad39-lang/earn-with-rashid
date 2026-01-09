
import React, { useState, useEffect, useRef } from 'react';
import { Send, BrainCircuit, Loader2, ExternalLink, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLessonQA } from '../services/gemini';

const MentorPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: 'Assalam-o-Alaikum! Main Rashid Ali ka AI Mentor hoon. Trading seekhne mein main aapki kya madad kar sakta hoon? Aaj kya market setup discuss karein?'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userText}]);
    setLoading(true);

    try {
      const reply = await getLessonQA(userText, "Global AI Mentor Chat. Teacher: Rashid Ali. Context: High precision SMC, institutional trading, Roman Urdu mentor.");
      setMessages(prev => [...prev, {role: 'bot', text: reply}]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'bot', text: "Maaf kijiye, net connection ka issue hai. Dobara koshish karein."}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] min-h-[500px] flex flex-col glass rounded-[3rem] border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="p-6 md:p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
         <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-500 hover:text-white"><ChevronLeft size={24}/></button>
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <BrainCircuit size={28} />
           </div>
           <div>
             <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">Rashid AI Mentor</h1>
             <p className="text-[10px] text-green-500 uppercase font-black tracking-widest flex items-center gap-1 mt-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Expert Online
             </p>
           </div>
         </div>
         <div className="hidden md:block">
            <a 
              href="https://share.google/RLkRKerN1JwueeUgJ" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[8px] text-zinc-600 hover:text-blue-500 transition-colors flex items-center justify-center gap-1 font-black uppercase tracking-widest group"
            >
              RASHID AI – BY CLYROTECH SOLUTIONS
              <ExternalLink size={8} />
            </a>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar bg-zinc-950/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-5 md:p-6 rounded-[2rem] text-[14px] leading-relaxed font-medium shadow-lg ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] rounded-tl-none shadow-lg">
              <Loader2 size={20} className="animate-spin text-blue-500" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-10 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex gap-4">
          <input 
            type="text"
            placeholder="Puchye, kya market ka hal hai?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-base outline-none focus:border-blue-500 transition-all font-medium"
          />
          <button 
            onClick={handleSend}
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 hover:bg-blue-700 transition-all shadow-xl active:scale-95"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorPage;
