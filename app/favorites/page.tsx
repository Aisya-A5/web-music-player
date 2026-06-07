"use client";

import React, { useState, useEffect } from 'react';
import { Play, Clock, MoreHorizontal, Heart, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load favorites from localStorage
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('likeloop_favorites');
      if (stored) {
        const favs = JSON.parse(stored);
        setFavorites(favs);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = (videoId: string) => {
    try {
      const updated = favorites.filter((fav) => fav.videoId !== videoId);
      setFavorites(updated);
      localStorage.setItem('likeloop_favorites', JSON.stringify(updated));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const playTrack = (track: any) => {
    router.push(`/player?id=${track.videoId}`);
  };

  const getArtistName = (track: any) => {
    if (track.artists && Array.isArray(track.artists)) {
      return track.artists.map((a: any) => a.name).join(", ");
    }
    return track.artist?.name || "Unknown Artist";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently";
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <Loader2 size={48} className="animate-spin text-[#E99D72]" />
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
            <span className="text-white font-bold">Your Collection</span> • {favorites.length} songs
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {favorites.length > 0 && (
        <div className="px-8 py-4 flex items-center gap-6">
          <button 
            onClick={() => playTrack(favorites[0])}
            className="w-14 h-14 bg-[#E99D72] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(233,157,114,0.4)] hover:scale-105 transition-transform"
          >
            <Play size={28} className="ml-1 fill-current" />
          </button>
        </div>
      )}

      {/* Tracks Container (Glassmorphism) */}
      <div className="px-8 pb-10 flex-1">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-xl">
          
          {favorites.length === 0 ? (
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
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[16px_minmax(200px,1fr)_minmax(150px,1fr)_minmax(100px,1fr)_80px] gap-4 px-4 py-3 border-b border-white/10 text-white/50 text-sm font-medium">
                <div className="text-center">#</div>
                <div>Title</div>
                <div className="hidden md:block">Album</div>
                <div className="hidden lg:block">Date added</div>
                <div className="flex justify-center">Actions</div>
              </div>

              {/* Track List */}
              <div className="mt-2 space-y-1">
                {favorites.map((track, index) => {
                  const coverUrl = track.thumbnails?.[0]?.url;
                  return (
                    <div 
                      key={`${track.videoId}-${index}`}
                      className="group grid grid-cols-[16px_minmax(200px,1fr)_minmax(150px,1fr)_minmax(100px,1fr)_80px] items-center gap-4 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                      onClick={() => playTrack(track)}
                    >
                      {/* Number / Play Icon */}
                      <div className="text-white/50 text-sm text-center relative w-full h-full flex items-center justify-center">
                        <span className="group-hover:opacity-0">{index + 1}</span>
                        <Play size={14} className="absolute opacity-0 group-hover:opacity-100 fill-white text-white" />
                      </div>

                      {/* Title & Artist */}
                      <div className="flex items-center gap-3 overflow-hidden">
                        {coverUrl ? (
                          <img src={coverUrl} alt={track.name} className="w-10 h-10 rounded-md object-cover shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
                            <Heart size={16} className="text-white/50" />
                          </div>
                        )}
                        <div className="flex flex-col truncate">
                          <span className="font-semibold text-white truncate">{track.name}</span>
                          <span className="text-xs text-white/60 truncate group-hover:text-white/90">{getArtistName(track)}</span>
                        </div>
                      </div>

                      {/* Album */}
                      <div className="text-sm text-white/60 truncate hidden md:block group-hover:text-white/90">
                        {track.album?.name || "-"}
                      </div>

                      {/* Date Added */}
                      <div className="text-sm text-white/60 truncate hidden lg:block">
                        {formatDate(track.addedAt)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(track.videoId);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-2"
                          title="Remove from favorites"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
