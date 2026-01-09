
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const CommunityWidget: React.FC = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    offsetRef.current = {
      x: clientX - position.x,
      y: window.innerHeight - clientY - position.y
    };
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = Math.max(10, Math.min(window.innerWidth - 60, clientX - offsetRef.current.x));
    const newY = Math.max(80, Math.min(window.innerHeight - 60, window.innerHeight - clientY - offsetRef.current.y));

    setPosition({ x: newX, y: newY });
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

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
      className="fixed z-[101] pointer-events-auto" 
      style={{ 
        left: `${position.x}px`, 
        bottom: `${position.y}px`,
      }}
    >
      <button 
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        onClick={() => {
          if (!isDragging) navigate('/community');
        }}
        className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-blue-500 shadow-2xl border-2 border-white/10 cursor-move hover:scale-110 transition-all relative"
        title="Community Hub"
      >
        <Users size={28} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-zinc-950 animate-pulse"></div>
      </button>
    </div>
  );
};

export default CommunityWidget;
