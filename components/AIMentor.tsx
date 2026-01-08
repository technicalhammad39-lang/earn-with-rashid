
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, BrainCircuit, Info, ExternalLink, GripHorizontal } from 'lucide-react';
import { getLessonQA } from '../services/gemini';

const AIMentor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    {role: 'bot', text: 'Assalam-o-Alaikum! Main Rashid Ali ka AI Mentor hoon. Trading seekhne mein main aapki kya madad kar sakta hoon?'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Draggable logic for the bubble
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userText}]);
    setLoading(true);

    try {
      const reply = await getLessonQA(userText, "Global AI Mentor Chat. Teacher: Rashid Ali.");
      setMessages(prev => [...prev, {role: 'bot', text: reply}]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'bot', text: "Maaf kijiye, net connection ka issue hai. Dobara koshish karein."}]);
    } finally {
      setLoading(false);
    }
  };

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    offsetRef.current = {
      x: window.innerWidth - clientX - position.x,
      y: window.innerHeight - clientY - position.y
    };
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Bounds check
    const newX = Math.max(10, Math.min(window.innerWidth - 60, window.innerWidth - clientX - offsetRef.current.x));
    const newY = Math.max(80, Math.min(window.innerHeight - 60, window.innerHeight - clientY - offsetRef.current.y));

    setPosition({ x: newX, y: newY });
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onDrag);
      window.addEventListener('touchend', stopDragging);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  return (
    <div 
      className="fixed z-[100]" 
      style={{ 
        right: isOpen ? '16px' : `${position.x}px`, 
        bottom: isOpen ? '90px' : `${position.y}px`,
        maxWidth: 'calc(100vw - 32px)'
      }}
    >
      {!isOpen ? (
        <div className="relative group">
           <button 
            onMouseDown={startDragging}
            onTouchStart={startDragging}
            onClick={(e) => {
              if (!isDragging) setIsOpen(true);
            }}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-900/50 hover:scale-110 transition-all border-2 border-white/10 cursor-move"
          >
            <BrainCircuit size={28} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-950 animate-pulse"></div>
          </button>
        </div>
      ) : (
        <div className="w-[320px] sm:w-[380px] h-[520px] max-h-[calc(100vh-120px)] glass border-zinc-800 rounded-[2rem] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
          <div 
            className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50"
          >
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <BrainCircuit size={20} />
               </div>
               <div>
                 <p className="font-bold text-sm tracking-tight">Rashid AI Mentor</p>
                 <p className="text-[10px] text-green-500 uppercase font-black tracking-widest flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Expert Online
                 </p>
               </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <X size={18} />
             </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-zinc-950/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.25rem] text-[13px] leading-relaxed font-medium shadow-lg ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-[1.25rem] rounded-tl-none shadow-lg">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
            <div className="flex gap-2 mb-3">
              <input 
                type="text"
                placeholder="Ask Rashid..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium"
              />
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            
            <div className="text-center">
               <a 
                 href="https://share.google/RLkRKerN1JwueeUgJ" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-[8px] text-zinc-600 hover:text-blue-500 transition-colors flex items-center justify-center gap-1 font-black uppercase tracking-widest group"
               >
                 ASHID AI – DEVELOPED BY CLYROTECH SOLUTIONS
                 <ExternalLink size={8} className="group-hover:translate-x-0.5 transition-transform" />
               </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMentor;
