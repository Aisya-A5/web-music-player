"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Play, Trash2, Music } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ambil data favorit dari localStorage pas halaman dimuat
    try {
      const stored = localStorage.getItem('likeloop_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Gagal memuat daftar favorit:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFavorite = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Biar pas diklik hapus, nggak ikutan pindah ke player
    
    const updated = favorites.filter((f) => f.videoId !== videoId);
    setFavorites(updated);
    localStorage.setItem('likeloop_favorites', JSON.stringify(updated));
  };

  const getArtistName = (track: any) => {
    if (track.artists && Array.isArray(track.artists)) {
      return track.artists.map((a: any) => a.name).join(", ");
    }
    return track.artist?.name || "Unknown Artist";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <p className="animate-pulse">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto custom-scrollbar">
      {/* Header Profile / Playlist Info */}
      <div className="p-8 pb-4 flex items-end gap-6 relative shrink-0">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-2xl bg-gradient-to-br from-[#E99D72] to-pink-500 flex items-center justify-center border border-white/20">
          <Heart size={64} className="text-white fill-current" />
        </div>
        <div className="flex flex-col gap-2 z-10">
          <span className="text-sm font-semibold tracking-wider uppercase text-white/70">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Liked Songs</h1>
          <p className="text-white/70 mt-2 text-sm font-medium">
            <span className="text-white font-bold">Your Collection</span> • {favorites.length} songs
          </p>
        </div>
      </div>

      {/* Tracks Container */}
      <div className="px-4 md:px-8 pb-10 flex-1">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 md:p-6 shadow-xl min-h-[50vh]">
          
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <Heart size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-semibold mb-2">Belum ada lagu favorit</p>
              <p className="text-sm text-center">Cari dan tambahkan lagu favoritmu dari halaman Player!</p>
              <button
                onClick={() => router.push('/player')}
                className="mt-6 px-6 py-3 bg-[#E99D72] text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                Cari Lagu
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Table Header */}
              <div className="flex items-center text-sm text-white/50 px-4 pb-2 border-b border-white/10 mb-2">
                <div className="w-8 text-center">#</div>
                <div className="flex-1">Judul</div>
                <div className="hidden md:block w-1/3">Artis</div>
                <div className="w-16 text-right">Aksi</div>
              </div>
              
              {/* Track List */}
              {favorites.map((track, index) => (
                <div 
                  key={track.videoId}
                  onClick={() => router.push(`/player?id=${track.videoId}`)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="w-8 text-center text-white/50 font-medium group-hover:hidden">
                    {index + 1}
                  </div>
                  <div className="w-8 text-center hidden group-hover:flex items-center justify-center text-[#E99D72]">
                    <Play size={16} className="fill-current" />
                  </div>
                  
                  <div className="flex-1 flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-black/20 shrink-0 flex items-center justify-center">
                      {track.thumbnails?.[0]?.url ? (
                        <img src={track.thumbnails[0].url} alt={track.name} className="w-full h-full object-cover" />
                      ) : (
                        <Music size={16} className="text-white/30" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">{track.name}</p>
                      <p className="text-sm text-white/50 truncate md:hidden">
                        {getArtistName(track)}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block w-1/3 truncate text-sm text-white/70">
                    {getArtistName(track)}
                  </div>

                  <div className="w-16 flex items-center justify-end">
                    <button 
                      onClick={(e) => removeFavorite(track.videoId, e)}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                      title="Hapus dari Favorit"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}