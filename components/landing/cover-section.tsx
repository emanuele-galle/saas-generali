"use client";

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

export function CoverSection({ consultant, coverData }: CoverSectionProps) {
  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const headline = coverData.headline ?? `Benvenuto, sono ${fullName}`;
  const subheadline =
    coverData.subheadline ??
    "Il tuo consulente finanziario di fiducia. Insieme possiamo costruire il tuo futuro.";
  const ctaText = coverData.ctaText ?? "Chiedi un appuntamento";
  const ctaHref = coverData.ctaHref ?? "#contatti";

  const gradientClass =
    coverData.backgroundGradient ??
    "bg-gradient-to-br from-[#1A1A1A] via-[#2d2d2d] to-[#1A1A1A]";

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      {coverData.backgroundImage ? (
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
        <div className={`absolute inset-0 ${gradientClass}`} />
      )}

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:gap-12 md:text-left">
          {/* Consultant Photo */}
          {consultant.profileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="shrink-0"
            >
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl sm:h-48 sm:w-48">
                <Image
                  src={consultant.profileImage}
                  alt={fullName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {headline}
            </h1>
            <p className="text-lg text-white/80 sm:text-xl">
              {subheadline}
            </p>
            <p className="text-sm font-medium text-primary-foreground/70">
              {consultant.role}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              className="mt-4"
            >
              <Button asChild size="lg" className="text-base">
                <a href={ctaHref}>{ctaText}</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
