"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_STREAM = "https://cast6.asurahosting.com/proxy/radioaga/stream";

export default function StickyPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [liveUrl, setLiveUrl] = useState<string>(DEFAULT_STREAM);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<"idle"|"connecting"|"live"|"buffering"|"error">("idle");
  const [attempt, setAttempt] = useState(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cacheBustedUrl = useMemo(() => `${liveUrl}${liveUrl.includes("?") ? "&" : "?"}t=${Date.now()}`,[liveUrl, attempt]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/v1/settings/stream.live_url");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data?.value) setLiveUrl(data.value);
      } catch (e) {
        // ignore, fallback to default
      }
    })();
    return () => { mounted = false; };
  }, []);

  const clearTimers = () => {
    if (retryTimer.current) { clearTimeout(retryTimer.current); retryTimer.current = null; }
    if (waitingTimer.current) { clearTimeout(waitingTimer.current); waitingTimer.current = null; }
  };

  const connect = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    clearTimers();
    try {
      setStatus("connecting");
      el.src = cacheBustedUrl;
      el.load();
      await el.play();
      setIsPlaying(true);
      setStatus("live");
      setAttempt(0);
    } catch (err) {
      setIsPlaying(false);
      setStatus("error");
      const backoff = Math.min(30000, 1000 * Math.pow(2, attempt || 0));
      retryTimer.current = setTimeout(() => setAttempt((a) => a + 1), backoff);
    }
  }, [cacheBustedUrl, attempt]);

  useEffect(() => {
    if (attempt > 0) connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onPlay = () => { setIsPlaying(true); setStatus("live"); };
    const onPause = () => { setIsPlaying(false); };
    const onWaiting = () => {
      setStatus("buffering");
      if (waitingTimer.current) clearTimeout(waitingTimer.current);
      waitingTimer.current = setTimeout(() => {
        setAttempt((a) => a + 1);
      }, 3000);
    };
    const onStalled = () => {
      setStatus("buffering");
      setAttempt((a) => a + 1);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setStatus("error");
      setAttempt((a) => a + 1);
    };
    const onError = () => {
      setIsPlaying(false);
      setStatus("error");
      setAttempt((a) => a + 1);
    };

    const onPauseLive = () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      setIsPlaying(false);
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("stalled", onStalled);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    window.addEventListener("radioagakiza:pause-live", onPauseLive as EventListener);

    const onOnline = () => setAttempt((a) => a + 1);
    window.addEventListener("online", onOnline);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("stalled", onStalled);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("radioagakiza:pause-live", onPauseLive as EventListener);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    let done = false;
    const handler = () => {
      if (!done) {
        done = true;
        connect();
        window.removeEventListener("click", handler);
        window.removeEventListener("keydown", handler);
        window.removeEventListener("touchstart", handler);
      }
    };
    window.addEventListener("click", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [connect]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      await connect();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur dark:bg-black/80">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <button
          onClick={toggle}
          className="h-10 w-10 rounded-full border flex items-center justify-center text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label={isPlaying ? "Pause live stream" : "Play live stream"}
        >
          {isPlaying ? "❚❚" : "►"}
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <span>LIVE • Radio Agakiza</span>
          </div>
          <span className="text-xs text-zinc-500">{status === "live" ? "Playing" : status === "buffering" ? "Buffering…" : status === "connecting" ? "Connecting…" : status === "error" ? "Reconnecting…" : "Idle"}</span>
        </div>
        <audio ref={audioRef} preload="none" />
      </div>
    </div>
  );
}
