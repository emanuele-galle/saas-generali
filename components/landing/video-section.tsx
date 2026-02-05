"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomVideoPlayer } from "@/components/landing/video-player";

interface VideoItem {
  id: string;
  url: string;
  title?: string;
}

interface VideoData {
  videoUrl?: string;
  title?: string;
  description?: string;
  videos?: VideoItem[];
}

interface VideoSectionProps {
  videoData: VideoData;
}

/* ── Helpers ──────────────────────────────────────────────── */

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function getThumbnailUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  return null;
}

function getVideoSource(url: string): "youtube" | "vimeo" | null {
  if (getYouTubeId(url)) return "youtube";
  if (url.match(/vimeo\.com\/(\d+)/)) return "vimeo";
  return null;
}

function isValidVideoUrl(url: string): boolean {
  return !!getVideoSource(url);
}

/* ── Normalize data (backward compat) ────────────────────── */

function normalizeVideos(data: VideoData): VideoItem[] {
  const items: VideoItem[] = [];

  if (data.videos && data.videos.length > 0) {
    items.push(...data.videos.filter((v) => v.url && isValidVideoUrl(v.url)));
  }

  if (items.length === 0 && data.videoUrl && isValidVideoUrl(data.videoUrl)) {
    items.push({ id: "legacy", url: data.videoUrl, title: data.title });
  }

  return items;
}

/* ── Video Card (thumbnail with play overlay) ────────────── */

function VideoCard({
  video,
  index,
  onClick,
}: {
  video: VideoItem;
  index: number;
  onClick: () => void;
}) {
  const thumbnail = getThumbnailUrl(video.url);
  const source = getVideoSource(video.url);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all hover:ring-2 hover:ring-white/30"
      style={{ width: "220px", aspectRatio: "9/16" }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={video.title || "Video"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--theme-color, #c21d17) 0%, #0a0a0a 100%)",
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/30">
          <Play className="h-6 w-6 fill-white text-white ml-0.5" />
        </div>
      </div>

      {source && (
        <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm">
          {source === "youtube" ? "YT" : "Vimeo"}
        </div>
      )}

      {video.title && (
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-sm font-medium leading-tight text-white line-clamp-2">
            {video.title}
          </p>
        </div>
      )}
    </motion.button>
  );
}

/* ── Modal Player (with CustomVideoPlayer) ───────────────── */

function VideoModal({
  videos,
  initialIndex,
  onClose,
}: {
  videos: VideoItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const current = videos[currentIndex];
  const hasMultiple = videos.length > 1;

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % videos.length);
  }, [videos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + videos.length) % videos.length);
  }, [videos.length]);

  // Keyboard: Escape to close, arrows for nav (player handles space/k/m/f)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Only use arrows for video navigation if Shift is held (avoid conflict with seek)
      if (e.key === "ArrowUp" && hasMultiple) {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowDown" && hasMultiple) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev, hasMultiple]);

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Chiudi"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
            aria-label="Video precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
            aria-label="Video successivo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Video player — 9:16 aspect */}
      <div
        className="relative mx-auto w-full max-w-sm"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <CustomVideoPlayer
          key={`${current.id}-${currentIndex}`}
          videoUrl={current.url}
          aspectRatio="9:16"
          autoPlay
        />
      </div>

      {/* Counter + title */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        {current.title && (
          <p className="mb-1 text-sm font-medium text-white">{current.title}</p>
        )}
        {hasMultiple && (
          <p className="text-xs text-white/50">
            {currentIndex + 1} / {videos.length}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Horizontal Scroll with grab-to-drag ─────────────────── */

function useHorizontalDrag(ref: React.RefObject<HTMLDivElement | null>) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      isDragging.current = false;
      if (el) el.style.cursor = "grab";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      el.scrollLeft = scrollLeft.current - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [ref]);
}

/* ── Main Section ─────────────────────────────────────────── */

export function VideoSection({ videoData }: VideoSectionProps) {
  const videos = normalizeVideos(videoData);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useHorizontalDrag(scrollRef);

  if (videos.length === 0) return null;

  // Single video: 16:9 custom player (no iframe visible, fully controlled)
  if (videos.length === 1 && !videoData.videos) {
    return (
      <section className="bg-[#0a0a0a] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {videoData.title && (
            <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-white/40">
              Video
            </p>
          )}
          {videoData.title && (
            <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
              {videoData.title}
            </h2>
          )}
          {videoData.description && (
            <p className="mx-auto mb-10 max-w-2xl text-center text-white/60">
              {videoData.description}
            </p>
          )}
          <div className="shadow-2xl shadow-black/50 ring-1 ring-white/10 rounded-2xl overflow-hidden">
            <CustomVideoPlayer videoUrl={videos[0].url} aspectRatio="16:9" />
          </div>
        </div>
      </section>
    );
  }

  // Multi-video: reels/shorts carousel
  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {videoData.title && (
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Video
          </p>
        )}
        {videoData.title && (
          <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
            {videoData.title}
          </h2>
        )}
        {videoData.description && (
          <p className="mx-auto mb-12 max-w-2xl text-center text-white/60">
            {videoData.description}
          </p>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:gap-6"
          style={{
            cursor: "grab",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            justifyContent: videos.length <= 4 ? "center" : undefined,
          }}
        >
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        {videos.length > 4 && (
          <p className="mt-3 text-center text-xs text-white/30">
            Scorri per vedere altri video
          </p>
        )}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <VideoModal
            videos={videos}
            initialIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
