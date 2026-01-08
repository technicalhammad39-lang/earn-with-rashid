
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ThumbsUp, 
  UserCircle, 
  Image as ImageIcon, 
  Award,
  MessageCircle,
  Repeat,
  GripHorizontal,
  Rss,
  Loader2,
  Plus
} from 'lucide-react';
import { User } from '../types';

interface Post {
  id: string;
  userId: string;
  userNickname: string;
  userPic?: string;
  content: string;
  image?: string;
  likes: string[];
  comments: { id: string, userNickname: string, text: string, time: number }[];
  time: number;
  official?: boolean;
  boosted?: boolean;
}

const INITIAL_POSTS: Post[] = [
  { 
    id: 'p1', 
    userId: 'u1',
    userNickname: 'Ahmed Trading', 
    content: "Guys, Gold (XAUUSD) looks like it's forming a perfect Head and Shoulders on 1H chart. What do you think Rashid bhai?", 
    likes: ['u2', 'u3'], 
    comments: [], 
    time: Date.now() - 3600000,
    image: 'https://images.unsplash.com/photo-1611974717482-48092895b9b8?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p3', 
    userId: 'rashid_main',
    userNickname: 'Rashid Mentor', 
    content: "Naya strategy video 'Trendline Secrets' upload ho chuka hai. Sub check karein aur simulator pe practice karein.", 
    likes: ['u1', 'u2', 'u3', 'u4', 'u5'], 
    comments: [], 
    time: Date.now() - 14400000,
    official: true,
    boosted: true
  },
];

const FeedWidget = ({ isOpen, setIsOpen, user }: { isOpen: boolean, setIsOpen: (v: boolean) => void, user: User }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Draggable state (using percentage or safe pixels)
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const saved = localStorage.getItem('er_community_posts');
      const data = saved ? JSON.parse(saved) : INITIAL_POSTS;
      setPosts(data);
      setTimeout(() => setLoading(false), 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('er_community_posts', JSON.stringify(posts));
    }
  }, [posts]);

  if (!isOpen) return null;

  const handlePost = () => {
    if (!newPostContent.trim() && !newPostImage) return;
    const post: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userNickname: user.nickname,
      userPic: user.profilePic,
      content: newPostContent,
      image: newPostImage || undefined,
      likes: [],
      comments: [],
      time: Date.now()
    };
    setPosts([post, ...posts]);
    setNewPostContent('');
    setNewPostImage(null);
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
    
    // Bounds check to keep widget on screen
    const newX = Math.max(10, Math.min(window.innerWidth - 320, window.innerWidth - clientX - offsetRef.current.x));
    const newY = Math.max(80, Math.min(window.innerHeight - 100, window.innerHeight - clientY - offsetRef.current.y));
    
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
      className="fixed z-[100] w-[320px] sm:w-[420px] h-[550px] glass border-zinc-800 rounded-[2.5rem] flex flex-col shadow-2xl animate-in fade-in zoom-in-95"
      style={{ 
        right: `${position.x}px`, 
        bottom: `${position.y}px`,
        maxHeight: 'calc(100vh - 120px)'
      }}
    >
      <div 
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 rounded-t-[2.5rem] cursor-grab active:cursor-grabbing"
      >
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
             <Rss size={20} />
           </div>
           <div>
             <p className="font-bold text-sm uppercase tracking-tight">Market Feed</p>
             <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Global Community</p>
           </div>
         </div>
         <div className="flex items-center gap-3">
            <GripHorizontal size={18} className="text-zinc-700" />
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-500 transition-all">
              <X size={18} />
            </button>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-zinc-950/20">
        {/* Create Post Area */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-3 shadow-inner">
          <textarea 
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
            placeholder="Share institutional logic or chart..."
            className="w-full bg-transparent border-none outline-none text-[13px] font-medium resize-none placeholder:text-zinc-700 min-h-[60px]"
          />
          {newPostImage && (
            <div className="relative group w-20 h-20 rounded-xl overflow-hidden">
               <img src={newPostImage} className="w-full h-full object-cover" alt="Preview" />
               <button onClick={() => setNewPostImage(null)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><X size={16}/></button>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-zinc-600 hover:text-blue-500 transition-colors text-[10px] font-black uppercase tracking-widest">
              <ImageIcon size={16} /> Attach
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setNewPostImage(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </button>
            <button 
              onClick={handlePost} 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              Post <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Loading / Empty State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-20">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-zinc-600">No posts yet. Be the first!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl space-y-3 relative overflow-hidden hover:bg-zinc-900/60 transition-colors shadow-lg">
              {post.boosted && <div className="absolute top-0 right-0 w-1 h-full bg-blue-600 shadow-[0_0_10px_#2563eb]"></div>}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-black overflow-hidden shadow-inner">
                  {post.userPic ? <img src={post.userPic} className="w-full h-full object-cover" alt="User" /> : <UserCircle size={20} className="text-zinc-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-black uppercase tracking-tight text-zinc-200">{post.userNickname}</p>
                    {post.official && <Award size={12} className="text-blue-500" />}
                  </div>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">{post.content}</p>
              {post.image && <img src={post.image} className="rounded-2xl border border-zinc-800 w-full object-cover max-h-48 shadow-2xl" alt="Shared chart" />}
              <div className="flex items-center gap-4 pt-3 border-t border-zinc-800/30">
                <button className="flex items-center gap-1.5 text-[10px] font-black text-zinc-500 hover:text-blue-500 transition-colors uppercase">
                  <ThumbsUp size={14} /> {post.likes.length}
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase">
                  <MessageCircle size={14} /> {post.comments.length}
                </button>
                <button className="ml-auto text-zinc-600 hover:text-blue-500 transition-colors">
                  <Repeat size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedWidget;
