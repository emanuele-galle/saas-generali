"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Loader2,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   Type declarations for YouTube IFrame API & Vimeo SDK
   ══════════════════════════════════════════════════════════ */

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getVolume(): number;
  setPlaybackRate(rate: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
}

interface VimeoPlayer {
  play(): Promise<void>;
  pause(): Promise<void>;
  setCurrentTime(seconds: number): Promise<number>;
  setVolume(volume: number): Promise<number>;
  getVolume(): Promise<number>;
  setPlaybackRate(rate: number): Promise<number>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  getPaused(): Promise<boolean>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback?: (...args: unknown[]) => void): void;
  destroy(): Promise<void>;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: string | HTMLElement,
        opts: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
            onError?: (e: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
    Vimeo?: {
      Player: new (
        el: string | HTMLElement,
        opts: Record<string, unknown>,
      ) => VimeoPlayer;
    };
  }
}

/* ══════════════════════════════════════════════════════════
   API loading (module-level singletons)
   ══════════════════════════════════════════════════════════ */

const ytQueue: (() => void)[] = [];
let ytLoading = false;

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    ytQueue.push(resolve);
    if (ytLoading) return;
    ytLoading = true;

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      ytQueue.forEach((cb) => cb());
      ytQueue.length = 0;
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
}

const vimeoQueue: (() => void)[] = [];
let vimeoLoading = false;

function loadVimeoAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Vimeo?.Player) {
      resolve();
      return;
    }
    vimeoQueue.push(resolve);
    if (vimeoLoading) return;
    vimeoLoading = true;

    const s = document.createElement("script");
    s.src = "https://player.vimeo.com/api/player.js";
    s.onload = () => {
      vimeoQueue.forEach((cb) => cb());
      vimeoQueue.length = 0;
    };
    document.head.appendChild(s);
  });
}

/* ══════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════ */

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getStoredVolume(): number {
  try {
    return parseInt(localStorage.getItem("cvp-vol") ?? "80", 10);
  } catch {
    return 80;
  }
}
function storeVolume(v: number) {
  try {
    localStorage.setItem("cvp-vol", String(v));
  } catch {}
}

/* ══════════════════════════════════════════════════════════
   ProgressBar (seekable)
   ══════════════════════════════════════════════════════════ */

function ProgressBar({
  current,
  total,
  onSeek,
}: {
  current: number;
  total: number;
  onSeek: (t: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const calcTime = useCallback(
    (clientX: number) => {
      if (!barRef.current || !total) return;
      const rect = barRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(ratio * total);
    },
    [total, onSeek],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: globalThis.MouseEvent) => calcTime(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, calcTime]);

  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      ref={barRef}
      className="group/bar relative h-1 w-full cursor-pointer bg-white/20 transition-all hover:h-1.5"
      onMouseDown={(e) => {
        setDragging(true);
        calcTime(e.clientX);
      }}
      onTouchStart={(e) => calcTime(e.touches[0].clientX)}
      onTouchMove={(e) => calcTime(e.touches[0].clientX)}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-full"
        style={{
          width: `${pct}%`,
          background: "var(--theme-color, #c21d17)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover/bar:opacity-100"
        style={{
          left: `${pct}%`,
          transform: `translateX(-50%) translateY(-50%)`,
          background: "var(--theme-color, #c21d17)",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CustomVideoPlayer
   ══════════════════════════════════════════════════════════ */

interface CustomVideoPlayerProps {
  videoUrl: string;
  aspectRatio?: "16:9" | "9:16";
  autoPlay?: boolean;
  className?: string;
}

export function CustomVideoPlayer({
  videoUrl,
  aspectRatio = "16:9",
  autoPlay = false,
  className,
}: CustomVideoPlayerProps) {
  /* ── Derived ─────────────────────────────────────────── */
  const youtubeId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);
  const vimeoId = useMemo(() => getVimeoId(videoUrl), [videoUrl]);
  const sourceType = youtubeId ? "youtube" : vimeoId ? "vimeo" : null;

  /* ── State ───────────────────────────────────────────── */
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(getStoredVolume);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  /* ── Refs ────────────────────────────────────────────── */
  const containerRef = useRef<HTMLDivElement>(null);
  const playerElRef = useRef<HTMLDivElement>(null);
  const ytRef = useRef<YTPlayer | null>(null);
  const vimeoRef = useRef<VimeoPlayer | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  /* ── Controls visibility ─────────────────────────────── */
  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (mountedRef.current) setControlsVisible(false);
    }, 3000);
  }, []);

  /* ── Progress polling ────────────────────────────────── */
  const startProgress = useCallback(() => {
    if (progressTimer.current) return;
    progressTimer.current = setInterval(async () => {
      if (!mountedRef.current) return;
      if (ytRef.current) {
        setCurrentTime(ytRef.current.getCurrentTime());
      } else if (vimeoRef.current) {
        const t = await vimeoRef.current.getCurrentTime();
        if (mountedRef.current) setCurrentTime(t);
      }
    }, 250);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  }, []);

  /* ── YouTube init ────────────────────────────────────── */
  useEffect(() => {
    if (sourceType !== "youtube" || !youtubeId || !playerElRef.current) return;
    mountedRef.current = true;

    let destroyed = false;

    loadYouTubeAPI().then(() => {
      if (destroyed || !window.YT || !playerElRef.current) return;

      const playerId = `yt-${youtubeId}-${Date.now()}`;
      playerElRef.current.id = playerId;

      ytRef.current = new window.YT.Player(playerId, {
        videoId: youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          mute: autoPlay ? 1 : 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            if (!mountedRef.current) return;
            setDuration(e.target.getDuration());
            e.target.setVolume(volume);
            setLoading(false);
            if (autoPlay) {
              e.target.playVideo();
              setPlaying(true);
              startProgress();
            }
          },
          onStateChange: (e) => {
            if (!mountedRef.current) return;
            const s = e.data;
            if (s === 1) {
              // PLAYING
              setPlaying(true);
              setLoading(false);
              startProgress();
              resetControlsTimer();
            } else if (s === 2) {
              // PAUSED
              setPlaying(false);
              stopProgress();
              setControlsVisible(true);
            } else if (s === 0) {
              // ENDED
              setPlaying(false);
              stopProgress();
              setControlsVisible(true);
            } else if (s === 3) {
              // BUFFERING
              setLoading(true);
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      mountedRef.current = false;
      stopProgress();
      try {
        ytRef.current?.destroy();
      } catch {}
      ytRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId, sourceType]);

  /* ── Vimeo init ──────────────────────────────────────── */
  useEffect(() => {
    if (sourceType !== "vimeo" || !vimeoId || !playerElRef.current) return;
    mountedRef.current = true;

    let destroyed = false;

    loadVimeoAPI().then(() => {
      if (destroyed || !window.Vimeo || !playerElRef.current) return;

      const player = new window.Vimeo.Player(playerElRef.current, {
        id: parseInt(vimeoId, 10),
        width: "100%",
        height: "100%",
        controls: false,
        autoplay: autoPlay,
        muted: autoPlay,
        dnt: true,
        title: false,
        byline: false,
        portrait: false,
        playsinline: true,
        transparent: false,
      });

      vimeoRef.current = player;

      player.on("loaded", async () => {
        if (!mountedRef.current) return;
        const d = await player.getDuration();
        if (mountedRef.current) {
          setDuration(d);
          setLoading(false);
          await player.setVolume(volume / 100);
        }
      });

      player.on("play", () => {
        if (!mountedRef.current) return;
        setPlaying(true);
        setLoading(false);
        startProgress();
        resetControlsTimer();
      });

      player.on("pause", () => {
        if (!mountedRef.current) return;
        setPlaying(false);
        stopProgress();
        setControlsVisible(true);
      });

      player.on("ended", () => {
        if (!mountedRef.current) return;
        setPlaying(false);
        stopProgress();
        setControlsVisible(true);
      });

      player.on("bufferstart", () => {
        if (mountedRef.current) setLoading(true);
      });
      player.on("bufferend", () => {
        if (mountedRef.current) setLoading(false);
      });
    });

    return () => {
      destroyed = true;
      mountedRef.current = false;
      stopProgress();
      try {
        vimeoRef.current?.destroy();
      } catch {}
      vimeoRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimeoId, sourceType]);

  /* ── Fullscreen change listener ──────────────────────── */
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* ── Keyboard shortcuts ──────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, muted, volume]);

  /* ── Player actions ──────────────────────────────────── */
  const togglePlay = useCallback(() => {
    if (ytRef.current) {
      const state = ytRef.current.getPlayerState();
      if (state === 1) ytRef.current.pauseVideo();
      else ytRef.current.playVideo();
    } else if (vimeoRef.current) {
      if (playing) vimeoRef.current.pause();
      else vimeoRef.current.play();
    }
  }, [playing]);

  const skip = useCallback(
    (delta: number) => {
      if (ytRef.current) {
        const t = ytRef.current.getCurrentTime();
        ytRef.current.seekTo(Math.max(0, t + delta), true);
      } else if (vimeoRef.current) {
        vimeoRef.current.getCurrentTime().then((t) => {
          vimeoRef.current?.setCurrentTime(Math.max(0, t + delta));
        });
      }
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

  const seekTo = useCallback(
    (t: number) => {
      if (ytRef.current) {
        ytRef.current.seekTo(t, true);
        setCurrentTime(t);
      } else if (vimeoRef.current) {
        vimeoRef.current.setCurrentTime(t);
        setCurrentTime(t);
      }
    },
    [],
  );

  const changeVolume = useCallback((v: number) => {
    setVolumeState(v);
    storeVolume(v);
    if (ytRef.current) {
      ytRef.current.setVolume(v);
      if (v > 0) {
        ytRef.current.unMute();
        setMuted(false);
      }
    } else if (vimeoRef.current) {
      vimeoRef.current.setVolume(v / 100);
      setMuted(v === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (ytRef.current) {
      if (ytRef.current.isMuted()) {
        ytRef.current.unMute();
        ytRef.current.setVolume(volume || 80);
        setMuted(false);
      } else {
        ytRef.current.mute();
        setMuted(true);
      }
    } else if (vimeoRef.current) {
      if (muted) {
        vimeoRef.current.setVolume((volume || 80) / 100);
        setMuted(false);
      } else {
        vimeoRef.current.setVolume(0);
        setMuted(true);
      }
    }
  }, [muted, volume]);

  const changeRate = useCallback((r: number) => {
    setRate(r);
    if (ytRef.current) ytRef.current.setPlaybackRate(r);
    else if (vimeoRef.current) vimeoRef.current.setPlaybackRate(r);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  /* ── Render ──────────────────────────────────────────── */
  if (!sourceType) return null;

  const ar = aspectRatio === "9:16" ? "9/16" : "16/9";

  return (
    <div
      ref={containerRef}
      className={`group/player relative overflow-hidden rounded-2xl bg-black ${className ?? ""}`}
      style={{ aspectRatio: ar }}
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
    >
      {/* Player container (YouTube/Vimeo creates iframe here) */}
      <div
        ref={playerElRef}
        className="absolute inset-0 h-full w-full"
      />

      {/* Click overlay — intercepts all clicks, blocks iframe interaction */}
      <div
        className="absolute inset-0 z-10"
        onClick={togglePlay}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-white/70" />
        </div>
      )}

      {/* Big center play button (when paused and not loading) */}
      {!playing && !loading && (
        <button
          className="absolute inset-0 z-20 flex items-center justify-center"
          onClick={togglePlay}
          aria-label="Riproduci"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
            <Play className="h-7 w-7 fill-white text-white ml-0.5" />
          </div>
        </button>
      )}

      {/* Controls bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 transition-opacity duration-300 ${
          controlsVisible || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setControlsVisible(true)}
      >
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative px-3 pb-3 pt-8">
          {/* Progress bar */}
          <ProgressBar current={currentTime} total={duration} onSeek={seekTo} />

          {/* Controls row */}
          <div className="mt-2 flex items-center gap-1 text-white sm:gap-2">
            {/* Back 10s */}
            <button
              onClick={() => skip(-10)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
              aria-label="Indietro 10 secondi"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
              aria-label={playing ? "Pausa" : "Riproduci"}
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-white" />
              ) : (
                <Play className="h-4 w-4 fill-white ml-0.5" />
              )}
            </button>

            {/* Forward 10s */}
            <button
              onClick={() => skip(10)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
              aria-label="Avanti 10 secondi"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* Volume */}
            <div className="group/vol flex items-center">
              <button
                onClick={toggleMute}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
                aria-label={muted ? "Attiva audio" : "Disattiva audio"}
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : volume < 50 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={(e) => changeVolume(parseInt(e.target.value, 10))}
                className="hidden h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/30 accent-white group-hover/vol:block [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Time */}
            <span className="ml-1 text-xs tabular-nums text-white/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Speed */}
            <select
              value={rate}
              onChange={(e) => changeRate(parseFloat(e.target.value))}
              className="h-7 cursor-pointer rounded bg-white/10 px-1.5 text-xs text-white outline-none transition-colors hover:bg-white/20"
              aria-label="Velocità riproduzione"
            >
              <option value={0.5}>0.5×</option>
              <option value={0.75}>0.75×</option>
              <option value={1}>1×</option>
              <option value={1.25}>1.25×</option>
              <option value={1.5}>1.5×</option>
              <option value={2}>2×</option>
            </select>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
              aria-label={fullscreen ? "Esci da schermo intero" : "Schermo intero"}
            >
              {fullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
