"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../../lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Auto-login as guest when page loads
    handleAutoLogin();
  }, []);

  const handleAutoLogin = async () => {
    setIsLoading(true);
    try {
      if (!auth) {
        throw new Error("Auth not initialized");
      }
      
      console.log("Auto-logging in as guest...");
      const result = await signInAnonymously(auth);
      console.log("✓ Logged in:", result.user.uid);
      
      // Redirect to home
      router.push("/");
    } catch (error: any) {
      console.error("Auto-login failed:", error);
      setErrorMsg("Failed to initialize. Please refresh the page.");
      setIsLoading(false);
    }
  };

  const handleManualLogin = () => {
    setErrorMsg("");
    handleAutoLogin();
  };

  return (
    <div className="flex min-h-full w-full items-center justify-center p-4 relative z-50 pointer-events-auto text-white">
      <div className="w-full max-w-[360px] rounded-[40px] bg-white/10 p-10 text-center shadow-2xl backdrop-blur-2xl border border-white/20">
        
        <div className="mb-10 flex flex-col items-center justify-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl shadow-xl">
             <img src="/likeloop_icon.png" alt="Likeloop Logo" className="h-full w-full object-cover" />
          </div>
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">Likeloop</span>
          <p className="mt-1 text-xs text-white/60">Your Personal Music Player</p>
        </div>

        {isLoading && !errorMsg && (
          <div className="flex flex-col items-center gap-4 my-8">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-sm text-white/60">Loading your music player...</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6">
            <div className="text-red-400 text-sm mb-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              {errorMsg}
            </div>
            <button 
              type="button"
              onClick={handleManualLogin}
              className="w-full rounded-full bg-white py-3.5 font-bold text-black shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !errorMsg && (
          <div className="text-center text-white/40 text-xs">
            <p>Preparing your personalized experience...</p>
          </div>
        )}
        
      </div>
    </div>
  );
}
