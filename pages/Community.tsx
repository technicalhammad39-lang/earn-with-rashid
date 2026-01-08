
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Send, 
  UserCircle, 
  Image as ImageIcon, 
  X, 
  Award,
  TrendingUp,
  MessageCircle,
  Repeat
} from 'lucide-react';
import { User } from '../types';

interface Post {
  id: string;
  userId: string;
  userNickname: string;
  userPic?: string;
  content: string;
  image?: string;
  likes: string[]; // user IDs
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
    id: 'p2', 
    userId: 'u2',
    userNickname: 'Trading Queen', 
    content: "Just finished the Supply and Demand course! Finally understanding why prices bounce from certain zones. Highly recommended! 🚀", 
    likes: ['u1'], 
    comments: [], 
    time: Date.now() - 7200000 
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

const Community = ({ user }: { user: User }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('er_community_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('er_community_posts', JSON.stringify(posts));
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewPostImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const liked = p.likes.includes(user.id);
        return {
          ...p,
          likes: liked ? p.likes.filter(id => id !== user.id) : [...p.likes, user.id]
        };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-widest w-fit">
           Professional Networking
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight">Community Hub</h1>
        <p className="text-zinc-500 font-medium">Discuss strategies, share charts, and grow with 12k+ traders.</p>
      </div>

      {/* Create Post Card */}
      <div className="glass rounded-[2rem] p-6 sm:p-8 border-zinc-800 shadow-2xl space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
             {user.profilePic ? (
               <img src={user.profilePic} className="w-full h-full object-cover" />
             ) : (
               <UserCircle className="text-zinc-700" size={32} />
             )}
          </div>
          <div className="flex-1">
            <textarea 
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="What's your institutional logic today? Share a setup..."
              className="w-full bg-zinc-900/30 border-none rounded-2xl p-4 min-h-[120px] outline-none focus:ring-1 focus:ring-blue-600/50 resize-none font-medium text-sm placeholder:text-zinc-600"
            />
            
            {newPostImage && (
              <div className="mt-4 relative inline-block">
                <img src={newPostImage} className="max-h-64 rounded-2xl border border-zinc-800 shadow-xl" />
                <button 
                  onClick={() => setNewPostImage(null)}
                  className="absolute -top-3 -right-3 p-1.5 bg-red-600 text-white rounded-full shadow-lg border-4 border-zinc-950"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-zinc-500 hover:text-blue-500 hover:bg-blue-600/5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <ImageIcon size={18} /> Add Chart Image
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </button>
          <button 
            onClick={handlePost}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-blue-900/30 active:scale-95"
          >
            Post Entry <Send size={16} />
          </button>
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-6">
        {posts.map(post => {
          const isLiked = post.likes.includes(user.id);
          return (
            <div key={post.id} className={`glass rounded-[2rem] p-6 sm:p-8 transition-all hover:bg-zinc-900/30 border-zinc-800/50 shadow-xl relative overflow-hidden group ${post.boosted ? 'border-l-4 border-l-blue-600' : ''}`}>
              {post.boosted && (
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                   <TrendingUp size={120} />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-500 overflow-hidden">
                    {post.userPic ? (
                      <img src={post.userPic} className="w-full h-full object-cover" />
                    ) : (
                      post.userNickname[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-sm uppercase tracking-tight">{post.userNickname}</p>
                      {post.official && (
                        <span className="flex items-center gap-1 text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                          <Award size={10} /> Mentor
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">
                       {new Date(post.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(post.time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-zinc-300 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                {post.content}
              </p>

              {post.image && (
                <div className="mb-8 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-video flex items-center justify-center">
                  <img src={post.image} className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" alt="Post attachment" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-6 border-t border-zinc-800/50">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${isLiked ? 'text-blue-500 bg-blue-600/5' : 'text-zinc-500 hover:text-white'}`}
                >
                  <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} /> {post.likes.length}
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                  <MessageCircle size={18} /> {post.comments.length}
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest ml-auto">
                  <Repeat size={18} /> Boost
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center py-10">
        <button className="px-10 py-4 glass border-zinc-800 rounded-2xl text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white hover:border-zinc-700 transition-all active:scale-95 shadow-lg">
          Load Previous Discussions
        </button>
      </div>
    </div>
  );
};

export default Community;
