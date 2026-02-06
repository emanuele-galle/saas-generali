"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CoverData {
  headline?: string;
  subheadline?: string;
  mainText?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
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
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "ready" || data.event === "play" || data.method) {
            setVideoReady(true);
          }
        } catch { /* not JSON */ }
      }
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

  const videoEmbedUrl = coverData.backgroundVideo
    ? getVideoEmbedUrl(coverData.backgroundVideo)
    : null;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background */}
      {videoEmbedUrl ? (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0A0A0A]" />
          <iframe
            src={videoEmbedUrl}
            className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
            allow="autoplay; fullscreen"
            style={{ border: 0, pointerEvents: "none" }}
            title="Background video"
          />
          <div className="absolute inset-0 bg-black/60" />
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
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#0A0A0A]" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mb-6 text-[clamp(1rem,2vw,1.5rem)] font-light uppercase tracking-[0.2em] text-white/60"
        >
          {subheadline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-white"
        >
          {headline}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="mt-10"
        >
          <a
            href={ctaHref}
            className="inline-block rounded-full bg-[#C21D17] px-8 py-4 text-lg font-bold text-white transition-colors duration-200 hover:bg-[#E8312B]"
          >
            {ctaText}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#chi-sono" className="block text-white/40 hover:text-white/60 transition-colors" aria-label="Scorri">
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </motion.svg>
        </a>
      </motion.div>
    </section>
  );
}
