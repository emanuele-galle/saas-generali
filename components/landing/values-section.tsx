"use client";

import {
  Heart,
  Shield,
  Eye,
  Award,
  Users,
  Target,
  Briefcase,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Shield, Eye, Award, Users, Target, Briefcase, TrendingUp,
};

interface ValuesData {
  title?: string;
  subtitle?: string;
  items: { title: string; description: string; icon?: string }[];
}

interface ValuesSectionProps {
  valuesData: ValuesData;
}

export function ValuesSection({ valuesData }: ValuesSectionProps) {
  const { items } = valuesData;
  if (!items || items.length === 0) return null;

  const title = valuesData.title ?? "I Miei Valori";

  return (
    <section id="valori" className="section-light py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Valori
        </p>
        <h2 className="mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
          {title}
        </h2>
        {valuesData.subtitle && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-[#6B7280]">
            {valuesData.subtitle}
          </p>
        )}

        <StaggerContainer
          className={`grid gap-6 ${
            items.length <= 2
              ? "md:grid-cols-2"
              : items.length === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {items.map((item, i) => {
            const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
            return (
              <StaggerItem key={i}>
                <div className="card-bold group h-full rounded-2xl p-8">
                  {IconComponent && (
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#C21D17]/10">
                      <IconComponent className="h-6 w-6 text-[#C21D17]" />
                    </div>
                  )}
                  <h3 className="mb-3 text-lg font-bold text-[#1A1A1A]">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-[#6B7280]">
                    {item.description}
                  </p>
                  <div className="mt-4 h-1 w-0 bg-[#C21D17] transition-all duration-300 ease-out group-hover:w-full" />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
