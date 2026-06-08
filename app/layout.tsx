"use client";

import React, { useState, useEffect } from "react";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Pastikan path ini sesuai dengan struktur folder kamu
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen w-screen bg-[#E99D72]"></div>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}