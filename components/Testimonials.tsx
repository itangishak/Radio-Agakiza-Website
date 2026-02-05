"use client";
import { useEffect, useRef, useState } from "react";

type Testimonial = { id: number; author_name: string; role: string; message: string };

async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch("/api/v1/testimonials/public?limit=9", { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const track = useRef<HTMLDivElement | null>(null);
  const idxRef = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchTestimonials().then((d) => { if (mounted) setItems(d); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!track.current) return;
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => move(1), 5000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [items.length]);

  const move = (step: number) => {
    const el = track.current; if (!el || items.length === 0) return;
    idxRef.current = (idxRef.current + step + items.length) % items.length;
    const w = el.clientWidth;
    el.scrollTo({ left: idxRef.current * (w * 0.9), behavior: 'smooth' });
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent">
          Ivyo bavuze
        </h2>
        <div className="hidden gap-3 sm:flex">
          <button 
            onClick={() => move(-1)} 
            className="rounded-full bg-white p-3 shadow-lg ring-1 ring-brand-200 transition-all hover:bg-brand-50 hover:shadow-xl"
          >
            <span className="text-brand-600">◄</span>
          </button>
          <button 
            onClick={() => move(1)} 
            className="rounded-full bg-white p-3 shadow-lg ring-1 ring-brand-200 transition-all hover:bg-brand-50 hover:shadow-xl"
          >
            <span className="text-brand-600">►</span>
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-brand-600">
          Nta ivyemezo biraboneka ubu.
        </div>
      )}

      <div ref={track} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {items.map((t, i) => (
          <blockquote 
            key={t.id} 
            className="group relative min-w-[90%] snap-center rounded-2xl bg-white p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-w-[45%] md:min-w-[30%]"
            style={{animationDelay: `${i * 150}ms`}}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/5 to-brand-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            
            {/* Quote icon */}
            <div className="mb-4 text-3xl text-accent-500/30">"</div>
            
            <p className="relative text-brand-800 line-clamp-6 leading-relaxed">
              {t.message}
            </p>
            
            <div className="relative mt-6 flex items-center gap-3 pt-4 border-t border-brand-100">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                {t.author_name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-brand-900">{t.author_name}</div>
                {t.role && (
                  <div className="text-sm text-brand-600">{t.role}</div>
                )}
              </div>
            </div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
