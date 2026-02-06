"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Play } from "lucide-react";
import { AnimateOnScroll } from "@/components/landing/animate-on-scroll";

const CustomVideoPlayer = dynamic(
  () => import("@/components/landing/video-player").then((m) => m.CustomVideoPlayer),
  { loading: () => <div className="aspect-video w-full animate-pulse rounded-2xl bg-[#F0EDEA]" /> },
);

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

function isValidVideoUrl(url: string): boolean {
  if (getYouTubeId(url)) return true;
  if (url.match(/vimeo\.com\/(\d+)/)) return true;
  return false;
}

interface InlineVideoProps {
  url: string;
  title?: string;
}

export function InlineVideo({ url, title }: InlineVideoProps) {
  const [playing, setPlaying] = useState(false);

  if (!url || !isValidVideoUrl(url)) return null;

  const thumbnail = getThumbnailUrl(url);

  return (
    <AnimateOnScroll variant="fade-up">
      <div className="mx-auto mt-16 max-w-3xl">
        {title && (
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-[#6B7280]">
            {title}
          </p>
        )}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {playing ? (
            <CustomVideoPlayer videoUrl={url} autoPlay />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative block aspect-video w-full"
            >
              {/* Thumbnail */}
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={title || "Video"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
                  }}
                />
              )}

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.15) 100%)",
                  opacity: 0.6,
                }}
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--theme-color, #C21D17), #E8312B)",
                    boxShadow: "0 8px 24px rgba(194,29,23,0.4)",
                  }}
                >
                  <Play className="ml-1 h-7 w-7 text-white" fill="white" />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </AnimateOnScroll>
  );
}
