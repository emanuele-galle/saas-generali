"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

interface PortfolioItem {
  title: string;
  category: string;
  imageUrl?: string;
  description?: string;
  linkUrl?: string;
}

interface PortfolioData {
  title?: string;
  items: PortfolioItem[];
}

interface PortfolioSectionProps {
  portfolioData: PortfolioData;
}

export function PortfolioSection({ portfolioData }: PortfolioSectionProps) {
  const { items } = portfolioData;
  const [activeCategory, setActiveCategory] = useState<string>("Tutti");

  if (!items || items.length === 0) return null;

  const title = portfolioData.title ?? "Portfolio";
  const categories = ["Tutti", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered =
    activeCategory === "Tutti"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Lavori
        </p>
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {title}
        </h2>

        {categories.length > 2 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--theme-color,#C21D17)] text-white shadow-lg shadow-[var(--theme-color,#C21D17)]/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <StaggerItem key={index}>
              <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-lg">
                {item.imageUrl ? (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    {item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="rounded-full bg-white/90 p-3 shadow-lg opacity-0 transition-all group-hover:opacity-100 group-hover:scale-100 scale-75">
                          <ExternalLink className="h-5 w-5 text-foreground" />
                        </span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center bg-muted">
                    <span className="text-5xl font-bold text-muted-foreground/20">
                      {item.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <span className="mb-2 inline-block rounded-full bg-[var(--theme-color,#C21D17)]/10 px-3 py-1 text-xs font-medium text-[var(--theme-color,#C21D17)]">
                    {item.category}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-foreground">
                    {item.linkUrl ? (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-[var(--theme-color,#C21D17)]"
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
