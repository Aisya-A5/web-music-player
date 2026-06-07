"use client";

import React, { useState, useEffect } from "react";
import { Library, Rss, TrendingUp, PlayCircle, Heart, LogOut } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/config"; 
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [pathname, setPathname] = useState("/");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // State untuk popup custom
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  // Tambahin properti 'requiresAuth' buat nentuin menu mana yang dikunci
  const navItems = [
    { name: "Library", path: "/", icon: <Library size={22} />, requiresAuth: false },
    { name: "Feed", path: "/feed", icon: <Rss size={22} />, requiresAuth: false },
    { name: "Trending", path: "/trending", icon: <TrendingUp size={22} />, requiresAuth: false },
    { name: "Player", path: "/player", icon: <PlayCircle size={22} />, requiresAuth: false },
    { name: "Favorites", path: "/favorites", icon: <Heart size={22} />, requiresAuth: true }, // Dikunci!
  ];

  return (
    <>
      <aside className="w-20 md:w-64 border-r border-white/10 flex flex-col justify-between bg-black/5 h-full">
        <div className="p-6">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
               <img src="/likeloop_icon.png" alt="Likeloop Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <span className="text-2xl font-bold hidden md:block tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Likeloop
            </span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <div
                  key={item.path}
                  onClick={() => {
                    // Cek kalau dia Guest (isAnonymous) dan menunya butuh login
                    if (item.requiresAuth && user?.isAnonymous) {
                      setShowModal(true); // Munculin popup!
                      return;
                    }
                    setPathname(item.path);
                    router.push(item.path);
                  }}
                  className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-white/20 text-white font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10 backdrop-blur-md"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:block text-sm">{item.name}</span>
                  {isActive && (
                    <div className="absolute left-2 w-1 h-6 bg-[#E99D72] rounded-r-md hidden md:block"></div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 text-white/70 hover:text-white transition-colors w-full justify-center md:justify-start"
          >
            <img 
              src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full bg-white/20 border border-white/30 object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white truncate w-32">
                {user?.isAnonymous ? "Guest User" : (user?.displayName || "User")}
              </p>
              <div className="flex items-center gap-1 text-xs mt-1 group cursor-pointer text-red-400 hover:text-red-300">
                <LogOut size={12} />
                <span>Logout</span>
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* POPUP CUSTOM KETIKA GUEST KLIK FAVORITES */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-8 rounded-[30px] shadow-2xl max-w-sm w-full text-center text-white">
            <Heart size={48} className="mx-auto text-[#E99D72] mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ups, Login Dulu!</h3>
            <p className="text-white/70 mb-8 text-sm">Fitur ini khusus untuk pengguna terdaftar. Yuk, login buat simpan lagu favoritmu!</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors font-semibold"
              >
                Nanti
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 py-3 rounded-full bg-[#E99D72] text-white hover:scale-105 transition-transform font-bold shadow-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}