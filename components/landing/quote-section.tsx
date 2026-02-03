"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteData {
  text?: string;
  author?: string;
  style?: "centered" | "left-accent";
}

interface QuoteSectionProps {
  quoteData: QuoteData;
}

export function QuoteSection({ quoteData }: QuoteSectionProps) {
  const { text, author, style = "centered" } = quoteData;

  if (!text) return null;

  if (style === "left-accent") {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-[var(--theme-color,#C21D17)] py-4 pl-8">
            <Quote className="mb-4 h-8 w-8 text-[var(--theme-color,#C21D17)] opacity-40" />
            <blockquote className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              {text}
            </blockquote>
            {author && (
              <p className="mt-4 text-base text-muted-foreground">
                &mdash; {author}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#111111] py-20 sm:py-28">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Quote className="mx-auto mb-8 h-12 w-12 text-[var(--theme-color,#C21D17)] opacity-30" />
          <blockquote className="text-2xl font-semibold leading-relaxed text-white sm:text-3xl lg:text-4xl">
            &ldquo;{text}&rdquo;
          </blockquote>
          {author && (
            <p className="mt-8 text-lg text-white/50">
              &mdash; {author}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
