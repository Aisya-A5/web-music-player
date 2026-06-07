import React from "react";
import { TrendingUp } from "lucide-react";

export default function TrendingPage() {
  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between z-10 sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp size={20} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Trending</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-8 h-full">
        {/* Wadah Glassmorphism Default */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl h-full flex items-center justify-center">
          <p className="text-white/50 text-xl font-medium">
            Konten Trending akan dimuat di sini...
          </p>
        </div>
      </div>
    </div>
  );
}