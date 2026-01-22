"use client";
import { useEffect, useRef } from "react";

export default function EpisodeAudio({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => {
      // Pause the live player to avoid double audio
      window.dispatchEvent(new Event("radioagakiza:pause-live"));
    };
    el.addEventListener("play", onPlay);
    return () => el.removeEventListener("play", onPlay);
  }, []);

  return (
    <audio ref={ref} src={src} controls preload="none" aria-label={title} className="w-full" />
  );
}
