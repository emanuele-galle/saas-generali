"use client";

import {
  BookOpen,
  Briefcase,
  Camera,
  Globe,
  Heart,
  Home,
  Leaf,
  Mountain,
  Music,
  Palette,
  Plane,
  Trophy,
  Utensils,
  Wine,
  Bike,
  Dumbbell,
  Film,
  Gamepad2,
  Sailboat,
  Dog,
  type LucideIcon,
} from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";
import { InlineVideo } from "@/components/landing/inline-video";

const ICON_MAP: Record<string, LucideIcon> = {
  book: BookOpen,
  briefcase: Briefcase,
  camera: Camera,
  globe: Globe,
  heart: Heart,
  home: Home,
  leaf: Leaf,
  mountain: Mountain,
  music: Music,
  palette: Palette,
  plane: Plane,
  trophy: Trophy,
  utensils: Utensils,
  wine: Wine,
  bike: Bike,
  dumbbell: Dumbbell,
  film: Film,
  gamepad: Gamepad2,
  sailboat: Sailboat,
  dog: Dog,
};

interface Interest {
  name: string;
  icon?: string;
}

interface InterestsData {
  title?: string;
  videoUrl?: string;
  interests: Interest[];
}

interface InterestsSectionProps {
  interestsData: InterestsData;
}

export function InterestsSection({ interestsData }: InterestsSectionProps) {
  const { interests } = interestsData;

  if (!interests || interests.length === 0) {
    return null;
  }

  const title = interestsData.title ?? "Interessi";

  return (
    <section className="section-dark py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Kicker */}
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Passioni
        </p>

        {/* Title */}
        <h2 className="font-display mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.02em] text-white">
          <TextReveal text={title} />
        </h2>

        {/* Accent line */}
        <div className="accent-line mx-auto mb-16" />

        {/* Grid */}
        <StaggerContainer className="mx-auto grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {interests.map((interest, index) => {
            const IconComponent = getIconForInterest(interest.icon);

            return (
              <StaggerItem key={index}>
                <div
                  className="card-glass group flex flex-col items-center gap-4 rounded-2xl p-6"
                  style={{
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1.05)";
                    el.style.borderColor = "rgba(212, 165, 55, 0.4)";
                    el.style.boxShadow = "0 0 30px rgba(212, 165, 55, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1)";
                    el.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Icon with gradient background */}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(194,29,23,0.25), rgba(212,165,55,0.2))",
                    }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-center text-sm font-medium text-white/90">
                    {interest.name}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {interestsData.videoUrl && (
          <InlineVideo url={interestsData.videoUrl} />
        )}
      </div>
    </section>
  );
}

function getIconForInterest(iconName?: string): LucideIcon {
  if (!iconName) return Heart;
  return ICON_MAP[iconName.toLowerCase()] ?? Heart;
}
