"use client";

import React, { useState } from "react";
import { Library, Rss, TrendingUp, PlayCircle, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [pathname, setPathname] = useState("/");
  const router = useRouter();

  const navItems = [
    { name: "Library", path: "/", icon: <Library size={22} /> },
    { name: "Feed", path: "/feed", icon: <Rss size={22} /> },
    { name: "Trending", path: "/trending", icon: <TrendingUp size={22} /> },
    { name: "Player", path: "/player", icon: <PlayCircle size={22} /> },
    { name: "Favorites", path: "/favorites", icon: <Heart size={22} /> },
  ];

  return (
    <aside className="w-20 md:w-64 border-r border-white/10 flex flex-col justify-between bg-black/5 h-full">
      <div className="p-6">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
            <img 
              src="/likeloop_icon.png" 
              alt="Likeloop Logo" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
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
        <div className="flex items-center gap-4 text-white/70 w-full justify-center md:justify-start">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Avatar" 
            className="w-10 h-10 rounded-full bg-white/20 border border-white/30 object-cover"
          />
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-white truncate w-32">
              User
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}