"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Play, Loader2, Disc3, ListMusic, Sparkles, Plus, MoreHorizontal, Heart } from "lucide-react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function PlayerContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); 
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // State untuk Antrean, Favorit, dan Rekomendasi
  const [queue, setQueue] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('likeloop_favorites');
      if (stored) {
        const favs = JSON.parse(stored);
        const ids = favs.map((f: any) => f.videoId);
        setFavorites(ids);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keep playing even when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Force playing to stay true even when tab is hidden
      if (document.hidden && currentTrack) {
        console.log("Tab hidden - keeping audio playing");
        setIsPlaying(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentTrack]);

  // EFEK REKOMENDASI DINAMIS: Jalan tiap lagu ganti
  useEffect(() => {
    if (!currentTrack) return;

    const fetchRecommendations = async () => {
      // Ambil nama artis pertama aja biar pencariannya lebih akurat
      const artistQuery = currentTrack.artists?.[0]?.name || currentTrack.artist?.name || "Lagu Hits";
      
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(artistQuery)}`);
        const data = await res.json();
        if (data.success) {
          // Singkirin lagu yang lagi diputar dari daftar rekomendasi, ambil 5 teratas
          const recs = data.data.filter((t: any) => t.videoId !== currentTrack.videoId).slice(0, 5);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error("Gagal ambil rekomendasi:", error);
      }
    };

    fetchRecommendations();
  }, [currentTrack]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error("Gagal mencari:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getArtistName = (track: any) => {
    if (track.artists && Array.isArray(track.artists)) {
      return track.artists.map((a: any) => a.name).join(", ");
    }
    return track.artist?.name || "Unknown Artist";
  };

  const addToQueue = (track: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue((prev) => [...prev, track]);
  };

  const toggleFavorite = (track: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const stored = localStorage.getItem('likeloop_favorites');
      const currentFavs = stored ? JSON.parse(stored) : [];
      
      const isFavorited = currentFavs.some((f: any) => f.videoId === track.videoId);
      
      if (isFavorited) {
        // Remove from favorites
        const updated = currentFavs.filter((f: any) => f.videoId !== track.videoId);
        localStorage.setItem('likeloop_favorites', JSON.stringify(updated));
        setFavorites(updated.map((f: any) => f.videoId));
      } else {
        // Add to favorites with full track data
        const newFav = {
          videoId: track.videoId,
          name: track.name,
          artist: track.artist,
          artists: track.artists || [],
          album: track.album,
          thumbnails: track.thumbnails || [],
          duration: track.duration || null,
          addedAt: new Date().toISOString()
        };
        const updated = [...currentFavs, newFav];
        localStorage.setItem('likeloop_favorites', JSON.stringify(updated));
        setFavorites(updated.map((f: any) => f.videoId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // FUNGSI AUTO-NEXT: Jalan kalau video/lagu udah selesai (onEnded)
  const handleTrackEnded = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setCurrentTrack(nextTrack);
      setQueue((prev) => prev.slice(1)); // Hapus dari antrean
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-6 p-4 md:p-8 text-white overflow-y-auto custom-scrollbar">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#E99D72]/20 flex items-center justify-center text-[#E99D72]">
            <Search size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cari & Putar</h1>
            <p className="text-white/50 text-sm">Temukan lagumu dan putar secara legal</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/50" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lagu dari YT Music..."
            className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E99D72]/50 transition-all shadow-inner"
          />
          <button type="submit" className="hidden">Cari</button>
        </form>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-40 gap-4 text-white/50 shrink-0">
          <Loader2 size={36} className="animate-spin text-[#E99D72]" />
          <p className="animate-pulse">Mencari mahakarya...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 shrink-0 mb-4">
          {results.map((track) => {
            const coverUrl = track.thumbnails?.[track.thumbnails.length - 1]?.url || track.thumbnails?.[0]?.url;
            const isFav = favorites.includes(track.videoId);

            return (
              <div key={track.videoId} className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer shadow-lg hover:-translate-y-2">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-md bg-black/20">
                  {coverUrl && (
                    <img src={coverUrl} alt={track.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] gap-3">
                    <button onClick={(e) => toggleFavorite(track, e)} className="text-white hover:scale-125 transition-transform" title="Favorit">
                      <Heart size={22} className={isFav ? "fill-[#E99D72] text-[#E99D72]" : ""} />
                    </button>
                    <button 
                      onClick={() => setCurrentTrack(track)}
                      className="w-14 h-14 bg-[#E99D72] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform" title="Putar"
                    >
                      <Play size={28} className="ml-1 fill-current" />
                    </button>
                    <button onClick={(e) => addToQueue(track, e)} className="text-white hover:scale-125 transition-transform" title="Tambah ke Antrean">
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-white truncate mb-1 text-lg">{track.name}</h3>
                <p className="text-sm text-white/50 truncate">
                  {getArtistName(track)}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        
        {/* Kiri: Player Utama & Rekomendasi */}
        <div className="w-full lg:w-[68%] flex flex-col gap-6">
          
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full aspect-video flex flex-col overflow-hidden relative">
            {isMounted && currentTrack ? (
              <div className="w-full h-full flex flex-col relative z-10">
                <ReactPlayer
                  src={`https://www.youtube.com/watch?v=${currentTrack.videoId}`}
                  playing={isPlaying}
                  controls={true}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  onEnded={handleTrackEnded} // Auto-play next di sini!
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-white/30 gap-4">
                <Disc3 size={64} className="animate-spin-slow opacity-20" />
                <p>Pilih lagu dari atas untuk mulai memutar</p>
              </div>
            )}
          </div>
          
          {/* Widget Rekomendasi Dinamis */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shrink-0 min-h-35">
            <div className="flex items-center gap-2 mb-4 text-white/80">
              <Sparkles size={18} className="text-[#E99D72]" />
              <h3 className="font-bold">Mungkin Kamu Suka</h3>
            </div>
            
            {recommendations.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {recommendations.map((rec) => (
                  <div 
                    key={rec.videoId} 
                    onClick={() => setCurrentTrack(rec)}
                    className="flex items-center justify-between bg-white/5 hover:bg-white/20 border border-white/10 rounded-full py-2 px-4 transition-colors cursor-pointer w-fit group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center group-hover:bg-[#E99D72] transition-colors">
                        <Play size={14} className="text-white ml-0.5" />
                      </div>
                      <div className="max-w-37.5">
                        <p className="text-sm font-semibold text-white truncate">{rec.name}</p>
                        <p className="text-xs text-white/50 truncate">{getArtistName(rec)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">Putar lagu dulu biar kita bisa cari rekomendasinya...</p>
            )}
          </div>
        </div>

        {/* Kanan: Info Lagu & Antrean (Queue) */}
        <div className="w-full lg:w-[30%] flex flex-col gap-6">
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shrink-0 flex flex-col items-center justify-center text-center">
             {currentTrack ? (
               <>
                 {currentTrack.thumbnails?.[currentTrack.thumbnails.length - 1]?.url && (
                   <img 
                     src={currentTrack.thumbnails[currentTrack.thumbnails.length - 1].url} 
                     alt="Cover" 
                     className="w-40 h-40 rounded-2xl shadow-xl mb-5 object-cover"
                   />
                 )}
                 <h3 className="font-bold text-xl truncate w-full">{currentTrack.name}</h3>
                 <p className="text-[#E99D72] text-sm truncate w-full">
                    {getArtistName(currentTrack)}
                 </p>
               </>
             ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                  <Disc3 size={48} className="mb-3" />
                  <p className="text-sm">Belum ada lagu yang diputar</p>
                </div>
             )}
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col max-h-100">
            <div className="flex items-center justify-between mb-4 text-white/80 shrink-0 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ListMusic size={18} className="text-[#E99D72]" />
                <h3 className="font-bold">Antrean</h3>
              </div>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{queue.length} Lagu</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {queue.length > 0 ? queue.map((item, idx) => (
                <div key={idx} onClick={() => setCurrentTrack(item)} className="flex items-center justify-between group cursor-pointer hover:bg-white/10 p-2 -mx-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-black/30 overflow-hidden flex items-center justify-center shrink-0">
                      {item.thumbnails?.[0]?.url ? (
                         <img src={item.thumbnails[0].url} alt={item.name} className="w-full h-full object-cover opacity-80" />
                      ) : (
                         <MusicIcon />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-xs text-white/50 truncate">{getArtistName(item)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-[#E99D72]" />
                  </div>
                </div>
              )) : (
                <div className="text-center text-white/30 text-sm py-4">
                  Klik ikon <Plus size={14} className="inline" /> pada lagu untuk menambah antrean
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function MusicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  );
}

export default function Player() {
  return (
    <Suspense fallback={<div className="text-white p-8 flex justify-center"><Loader2 className="animate-spin" /></div>}>
      <PlayerContent />
    </Suspense>
  );
}