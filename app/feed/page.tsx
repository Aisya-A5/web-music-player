import React from 'react';
import { Heart, MessageCircle, Share2, Play, Music, Rss } from 'lucide-react';

// --- MOCK DATA FEED ---
const FEED_POSTS = [
  {
    id: 1,
    author: 'Tulus',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a1a2a5fd37b4?w=100&q=80',
    time: '2 jam yang lalu',
    action: 'merilis single baru',
    content: 'Akhirnya rilis juga! Semoga "Hati-Hati di Jalan" bisa menemani perjalanan kalian hari ini. Selamat mendengarkan! 🎧',
    media: 'https://images.unsplash.com/photo-1493225457124-a1a2a5fd37b4?w=600&q=80',
    likes: '12.4K',
    comments: '450',
  },
  {
    id: 2,
    author: 'Alex (Teman)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    time: '5 jam yang lalu',
    action: 'menyukai playlist',
    content: 'Lagi butuh fokus buat nugas malam ini. Playlist "Late Night Drive" ini emang paling bener.',
    media: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80',
    likes: '24',
    comments: '3',
  },
  {
    id: 3,
    author: 'Joji',
    avatar: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&q=80',
    time: '1 hari yang lalu',
    action: 'membagikan lagu',
    content: 'Glimpse of Us. Out now everywhere.',
    media: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    likes: '89.2K',
    comments: '2.1K',
  }
];

export default function FeedPage() {
  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between z-10 sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E99D72]/20 flex items-center justify-center text-[#E99D72]">
            <Rss size={20} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Activity Feed
          </h1>
        </div>
      </header>

      {/* Main Feed Container */}
      <div className="p-8 max-w-3xl mx-auto w-full space-y-8">
        
        {/* Create Post Input (Opsional) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User" 
            className="w-10 h-10 rounded-full bg-white/20"
          />
          <input 
            type="text" 
            placeholder="Bagikan lagu yang sedang kamu dengarkan..." 
            className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-sm"
          />
          <button className="bg-[#E99D72] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#d88c61] transition-colors whitespace-nowrap">
            Post
          </button>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6 pb-10">
          {FEED_POSTS.map((post) => (
            <article key={post.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
              
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                  <div>
                    <p className="font-semibold text-white">
                      {post.author} <span className="text-white/60 font-normal text-sm">{post.action}</span>
                    </p>
                    <p className="text-xs text-white/50">{post.time}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-white/80 mb-4 text-sm leading-relaxed">
                {post.content}
              </p>

              {/* Media Card (Album/Song cover) */}
              <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-[2/1] mb-4 group cursor-pointer border border-white/10">
                <img src={post.media} alt="Post media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button className="w-16 h-16 bg-[#E99D72]/90 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    <Play size={32} className="ml-1 fill-current" />
                  </button>
                </div>
                {/* Badge */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                  <Music size={14} className="text-[#E99D72]" />
                  <span className="text-xs font-medium">Putar Lagu</span>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-white/10 text-white/60">
                <button className="flex items-center gap-2 hover:text-[#E99D72] transition-colors group">
                  <Heart size={18} className="group-hover:fill-[#E99D72]" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                  <Share2 size={18} />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </div>
  );
}