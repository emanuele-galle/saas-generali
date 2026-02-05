"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CoverData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundVideo?: string;
}

interface CoverSectionProps {
  consultant: {
    firstName: string;
    lastName: string;
    title?: string | null;
    role: string;
    profileImage?: string | null;
  };
  coverData: CoverData;
}

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1&title=0&byline=0&portrait=0`;
  }
  return null;
}

export function CoverSection({ consultant, coverData }: CoverSectionProps) {
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Vimeo sends postMessage when video starts playing
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "ready" || data.event === "play" || data.method) {
            setVideoReady(true);
          }
        } catch { /* not JSON */ }
      }
      // YouTube sends postMessage with info events
      if (typeof event.data === "object" && event.data?.event === "onReady") {
        setVideoReady(true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const headline = coverData.headline ?? fullName;
  const subheadline = coverData.subheadline ?? consultant.role;
  const ctaText = coverData.ctaText ?? "Scopri di più";
  const ctaHref = coverData.ctaHref ?? "#chi-sono";

  const gradientClass =
    coverData.backgroundGradient ??
    "bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]";

  const videoEmbedUrl = coverData.backgroundVideo
    ? getVideoEmbedUrl(coverData.backgroundVideo)
    : null;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background */}
      {videoEmbedUrl ? (
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${gradientClass}`} />
          <iframe
            src={videoEmbedUrl}
            className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
            allow="autoplay; fullscreen"
            style={{ border: 0, pointerEvents: "none" }}
            title="Background video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>
      ) : coverData.backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={coverData.backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>
      ) : (
        <div className={`absolute inset-0 ${gradientClass}`} />
      )}

      {/* Decorative blobs */}
      <motion.div
        className="absolute -left-32 top-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--theme-color, #c21d17)" }}
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--theme-color, #c21d17)" }}
        animate={{
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        {consultant.profileImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative"
            >
              {/* Pulsing ring */}
              <div
                className="absolute -inset-2 rounded-full opacity-40"
                style={{
                  background: `conic-gradient(from 0deg, var(--theme-color, #c21d17), transparent, var(--theme-color, #c21d17))`,
                  animation: "pulse-glow 3s ease-in-out infinite",
                }}
              />
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl ring-4 ring-white/10 sm:h-40 sm:w-40">
                <Image
                  src={consultant.profileImage}
                  alt={fullName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1
            className="font-bold tracking-tight text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            {headline}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-6"
        >
          <p className="text-lg font-light uppercase tracking-[0.2em] text-white/60 sm:text-xl md:text-2xl">
            {subheadline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
          className="mt-10"
        >
          <Button
            asChild
            size="lg"
            className="relative overflow-hidden rounded-full px-10 py-6 text-base font-medium tracking-wide"
            style={{
              background: `linear-gradient(135deg, var(--theme-color, #c21d17), color-mix(in srgb, var(--theme-color, #c21d17) 70%, #ff6b6b))`,
            }}
          >
            <a href={ctaHref}>
              <span className="relative z-10">{ctaText}</span>
              <span
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator - mouse SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#chi-sono" className="block" aria-label="Scorri">
          <svg
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            className="text-white/40"
          >
            <rect
              x="1"
              y="1"
              width="22"
              height="34"
              rx="11"
              stroke="currentColor"
              strokeWidth="2"
            />
            <motion.circle
              cx="12"
              r="3"
              fill="currentColor"
              initial={{ cy: 10 }}
              animate={{ cy: [10, 20, 10] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
