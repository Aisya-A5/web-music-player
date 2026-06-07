"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Kalau lagi di /login, render polos aja (tanpa Sidebar & kotak utama)
  if (pathname === "/login") {
    return <div className="h-full w-full">{children}</div>;
  }

  // Kalau di halaman lain, render full dengan Sidebar
  return (
    <div className="p-4 sm:p-6 flex items-center justify-center h-full w-full">
      <div className="relative w-full h-full max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex overflow-hidden z-10">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}