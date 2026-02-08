"use client";
import { useEffect, useRef, useState } from "react";

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function EpisodeAudio({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => {
      window.dispatchEvent(new Event("radioagakiza:pause-live"));
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoaded = () => setDuration(el.duration);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoaded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  const togglePlayback = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  const onSeek = (value: number) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? `Hagarika ${title}` : `Tangira ${title}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-brand-600 text-white shadow-lg shadow-accent-500/30 transition-transform hover:scale-105"
        >
          <span className="text-lg">{isPlaying ? "⏸️" : "▶️"}</span>
        </button>
        <div>
          <p className="text-sm font-semibold text-brand-800">Kanda wumve</p>
          <p className="text-xs text-brand-600">{title}</p>
        </div>
        <div className="ml-auto text-xs font-medium text-brand-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={currentTime}
        onChange={(event) => onSeek(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-200 accent-accent-500"
        aria-label={`Hindura aho ugeze muri ${title}`}
      />
      <audio ref={ref} src={src} preload="none" aria-label={title} className="sr-only" />
    </div>
  );
}
