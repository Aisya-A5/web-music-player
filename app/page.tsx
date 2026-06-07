"use client";

import React from "react";
import { Play } from "lucide-react";

// --- MOCK DATA PLAYLIST ---
const PLAYLISTS = [
  { id: 1, title: 'Chill Vibes', tracks: 45, image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5fd37b4?w=400&q=80' },
  { id: 2, title: 'Top Hits 2026', tracks: 100, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80' },
  { id: 3, title: 'Late Night Drive', tracks: 32, image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80' },
  { id: 4, title: 'Acoustic Pop', tracks: 50, image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col h-full text-white p-4 md:p-8">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        <div className="space-y-8">
          
          {/* Banner Promo */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 p-8 backdrop-blur-sm shadow-xl">
            <div className="relative z-10 md:w-2/3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md border border-white/30">Trending Now</span>
              <h2 className="text-4xl font-bold mt-4 mb-2">New Release Radar</h2>
              <p className="text-white/70 mb-6">Discover the best new music picked just for you, updated every Friday.</p>
              <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
                <Play size={18} className="fill-current" /> Listen Now
              </button>
            </div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-purple-500/40 to-transparent rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/4"></div>
          </div>

          {/* Grid Playlists Tersimpan */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white/90">Your Saved Playlists</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {PLAYLISTS.map((playlist) => (
                <div key={playlist.id} className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-md bg-black/20">
                    <img src={playlist.image} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button className="w-12 h-12 bg-[#E99D72]/90 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                        <Play size={24} className="ml-1 fill-current" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-white mb-1">{playlist.title}</h4>
                  <p className="text-sm text-white/60">{playlist.tracks} Tracks</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}