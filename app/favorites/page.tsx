"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  // 1. Kunci state favorites agar selalu kosong []
  const [favorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 2. Langsung matikan loading tanpa membaca data apa pun
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header Profile / Playlist Info */}
      <div className="p-8 pb-4 flex items-end gap-6 relative">
        <div className="w-40 h-40 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center border border-white/20">
          <Heart size={64} className="text-white fill-current" />
        </div>
        <div className="flex flex-col gap-2 z-10">
          <span className="text-sm font-semibold tracking-wider uppercase text-white/70">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Liked Songs</h1>
          <p className="text-white/70 mt-2 text-sm font-medium">
            <span className="text-white font-bold">Your Collection</span> • 0 songs
          </p>
        </div>
      </div>

      {/* Tracks Container (Glassmorphism) */}
      <div className="px-8 pb-10 flex-1">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-xl">
          
          {/* 3. Tampilan otomatis jatuh ke kondisi kosong ini */}
          <div className="flex flex-col items-center justify-center py-20 text-white/50">
            <Heart size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-semibold mb-2">No liked songs yet</p>
            <p className="text-sm">Start exploring music and add your favorites!</p>
            <button
              onClick={() => router.push('/player')}
              className="mt-6 px-6 py-3 bg-[#E99D72] text-white rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Discover Music
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}