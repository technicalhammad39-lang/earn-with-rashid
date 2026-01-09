
import React, { useState, useEffect, useRef } from 'react';
import { 
  ThumbsUp, 
  UserCircle, 
  Award,
  MessageCircle,
  Plus,
  Users,
  Loader2,
  Send,
  Camera,
  X,
  ExternalLink
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
    userNickname: 'Ali Trader', 
    content: "Gold is hitting major resistance at 2350. Watch for reversal guys!", 
    likes: ['u2', 'u3'], 
    comments: [], 
    time: Date.now() - 3600000,
    image: 'https://images.unsplash.com/photo-1611974717482-48092895b9b8?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p3', 
    userId: 'rashid_main',
    userNickname: 'Rashid Mentor', 
    content: "Binary options special course updated. Check academy now.", 
    likes: ['u1', 'u2', 'u3', 'u4', 'u5'], 
    comments: [], 
    time: Date.now() - 14400000,
    official: true,
    boosted: true
  },
];

const CommunityPage: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('er_community_posts');
    const data = saved ? JSON.parse(saved) : INITIAL_POSTS;
    setPosts(data);
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('er_community_posts', JSON.stringify(posts));
    }
  }, [posts]);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Community Hub</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Connect & Learn from Professionals</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Create Post */}
          <div className="glass p-6 rounded-[2rem] border-zinc-800 space-y-4 bg-zinc-900/10 shadow-xl">
            <textarea 
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="What's your analysis today? Share a setup..."
              className="w-full bg-transparent border-none outline-none text-base font-medium resize-none placeholder:text-zinc-700 min-h-[100px]"
            />
            {newPostImage && (
              <div className="relative group w-full max-h-[300px] rounded-2xl overflow-hidden border border-zinc-800">
                 <img src={newPostImage} className="w-full h-full object-contain bg-black" alt="Preview" />
                 <button onClick={() => setNewPostImage(null)} className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white hover:bg-red-600 transition-all"><X size={20}/></button>
              </div>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors text-[10px] font-black uppercase tracking-widest">
                <Camera size={18} /> Attach Chart
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setNewPostImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </button>
              <button onClick={handlePost} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                Post <Send size={14} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="animate-spin text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Updating Feed...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="glass p-6 rounded-[2rem] border-zinc-800 space-y-4 hover:border-zinc-700 transition-all shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                        {post.userPic ? <img src={post.userPic} className="w-full h-full object-cover" /> : <UserCircle size={24} className="text-zinc-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-zinc-100">{post.userNickname}</p>
                          {post.official && <Award size={14} className="text-blue-500" />}
                        </div>
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{new Date(post.time).toLocaleDateString()} • {new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-medium">{post.content}</p>
                  {post.image && <img src={post.image} className="rounded-2xl border border-zinc-800 w-full object-cover max-h-[400px] shadow-2xl" />}
                  <div className="flex items-center gap-6 pt-4 border-t border-zinc-800/50">
                    <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-blue-500 transition-colors uppercase tracking-widest">
                      <ThumbsUp size={16} /> {post.likes.length} Likes
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
                      <MessageCircle size={16} /> {post.comments.length} Comments
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-6 rounded-[2rem] border-zinc-800 bg-blue-600/5">
              <h3 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Award className="text-blue-500" /> Active Mentors</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                       <img src="https://i.ibb.co/9kx3Yg31/rashid-portrait.jpg" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold">Rashid Ali</span>
                    <span className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                 </div>
              </div>
           </div>

           <div className="glass p-6 rounded-[2rem] border-zinc-800">
              <h3 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">Platform Rules</h3>
              <ul className="space-y-2 text-[10px] text-zinc-500 font-medium list-disc pl-4">
                 <li>Be respectful to other traders.</li>
                 <li>No spam or irrelevant marketing.</li>
                 <li>Share charts with logical analysis.</li>
              </ul>
           </div>

           {/* Branding Sidebar */}
           <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] text-center space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Infrastructure Support</p>
              <a 
                href="https://maps.app.goo.gl/3XyVv8Jk8vXv5zXN8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <span className="text-xs font-black tracking-tighter text-zinc-400 group-hover:text-blue-500 transition-colors">Clyro Tech Solutions</span>
                <ExternalLink size={14} className="text-zinc-700 group-hover:text-blue-500" />
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
