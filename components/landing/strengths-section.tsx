"use client";

import {
  Shield,
  Award,
  Heart,
  Users,
  Target,
  TrendingUp,
  Briefcase,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, Award, Heart, Users, Target, TrendingUp, Briefcase, Eye,
};

interface StrengthsData {
  title?: string;
  subtitle?: string;
  items: { title: string; description: string; icon?: string }[];
}

interface StrengthsSectionProps {
  strengthsData: StrengthsData;
}

export function StrengthsSection({ strengthsData }: StrengthsSectionProps) {
  const { items } = strengthsData;
  if (!items || items.length === 0) return null;

  const title = strengthsData.title ?? "Perche Scegliermi";

  return (
    <section
      id="punti-forza"
      className="py-24 md:py-32 lg:py-40"
      style={{
        background:
          "linear-gradient(180deg, #FAFAFA 0%, #F5F3F0 50%, #FAFAFA 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Punti di Forza
        </p>
        <h2 className="mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
          {title}
        </h2>
        {strengthsData.subtitle && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-[#6B7280]">
            {strengthsData.subtitle}
          </p>
        )}

        <StaggerContainer
          className={`grid gap-6 ${
            items.length <= 2
              ? "md:grid-cols-2"
              : items.length === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((item, i) => {
            const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
            return (
              <StaggerItem key={i}>
                <div className="flex h-full rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
                  <div
                    className="mr-6 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--theme-color, #C21D17)" }}
                  />
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      {IconComponent && (
                        <IconComponent className="h-5 w-5 text-[#C21D17]" />
                      )}
                      <h3 className="text-lg font-bold text-[#1A1A1A]">{item.title}</h3>
                    </div>
                    <p className="text-base leading-relaxed text-[#6B7280]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
