"use client";
import { useEffect, useRef, useState } from "react";

type Live = { live: null | { name: string; start_time: string; end_time: string; timezone: string } };

export default function HeroSection() {
  const play = () => window.dispatchEvent(new Event("radioagakiza:play-live"));
  const [now, setNow] = useState<Live | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/v1/programs/live", { cache: "no-store" });
        if (!mounted) return;
        if (res.ok) setNow(await res.json());
      } catch {}
    })();
    const onScroll = () => {
      if (!waveRef.current) return;
      const y = window.scrollY * 0.08;
      waveRef.current.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { mounted = false; window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />
      <div className="absolute inset-0 bg-[url('/radioagakizalogo.png')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-800/40 to-transparent" />
      
      {/* Floating elements */}
      <div ref={waveRef} className="pointer-events-none absolute -top-12 left-0 right-0 h-32 bg-gradient-to-r from-accent-500/30 via-transparent to-accent-500/30 blur-3xl animate-pulse" />
      
      {/* Geometric shapes */}
      <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-accent-500/20 blur-xl animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}} />
      <div className="absolute top-40 right-20 h-16 w-16 rounded-full bg-brand-400/30 blur-lg animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}} />
      <div className="absolute bottom-32 left-1/4 h-12 w-12 rounded-full bg-accent-400/25 blur-md animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}} />

      <div className="relative z-10 flex min-h-[85vh] items-center">
        <div className="mx-auto max-w-6xl px-6 text-center text-white">
          {/* Live indicator */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white/95 ring-1 ring-white/30 backdrop-blur-md">
            <span className="relative inline-flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
            </span>
            IKIBIRIRAHO
          </div>

          {/* Main heading */}
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl mb-6">
            <span className="bg-gradient-to-r from-white via-white to-accent-200 bg-clip-text text-transparent drop-shadow-2xl">
              RADIO
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent drop-shadow-2xl">
              AGAKIZA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 mb-10">
            Gutangaza Icizere, Ukwizera n'Ukuri — Ijwi ry'ivyizigiro ku mitima yose.
          </p>

          {/* CTA Button */}
          <div className="mb-12">
            <button 
              onClick={play} 
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-accent-500/30 transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:shadow-accent-500/40"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">▶️</span>
              Tega amatwi ubu
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </button>
          </div>

          {/* Now Playing Card */}
          <div className="mx-auto max-w-lg">
            <div className="rounded-2xl bg-white/10 p-6 text-left backdrop-blur-xl ring-1 ring-white/20 shadow-2xl">
              {now?.live ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                    </span>
                    Ikibiriraho
                  </div>
                  <div className="text-xl font-bold text-white">{now.live.name}</div>
                  <div className="text-sm text-white/70">
                    {now.live.start_time}–{now.live.end_time} ({now.live.timezone})
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                    </span>
                    Ikibiriraho
                  </div>
                  <div className="text-center text-white/80">
                    Nta kiganiro kiri kuri mur'iki kanya.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
