"use client";

import Image from "next/image";
import {
  Video,
  BookOpen,
  Mic,
  Globe,
  Megaphone,
  PenTool,
  Award,
  Users,
  TrendingUp,
  Target,
  Briefcase,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

const ICON_MAP: Record<string, LucideIcon> = {
  Video, BookOpen, Mic, Globe, Megaphone, PenTool,
  Award, Users, TrendingUp, Target, Briefcase, Heart,
};

interface Skill {
  name: string;
  description?: string;
  icon?: string;
  imageIcon?: string;
  imageUrl?: string;
  linkUrl?: string;
  forWho?: string;
  whatWeDo?: string;
  benefit?: string;
}

interface SkillsData {
  title?: string;
  skills: Skill[];
}

interface SkillsSectionProps {
  skillsData: SkillsData;
}

function SkillCard({ skill }: { skill: Skill }) {
  const IconComponent = skill.icon ? ICON_MAP[skill.icon] : null;

  const card = (
    <div className="card-bold group h-full overflow-hidden rounded-2xl">
      {/* Image top */}
      {skill.imageUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={skill.imageUrl}
            alt={skill.name}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#C21D17]/5 to-[#D4A537]/5">
          {skill.imageIcon ? (
            <div className="relative h-16 w-16">
              <Image src={skill.imageIcon} alt={skill.name} fill className="object-contain" />
            </div>
          ) : IconComponent ? (
            <IconComponent className="h-16 w-16 text-[#C21D17]/60" />
          ) : (
            <span className="text-5xl font-black text-[#C21D17]/20">
              {skill.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="p-8">
        <h3 className="text-xl font-bold text-[#1A1A1A]">{skill.name}</h3>
        {skill.description && (
          <p className="mt-2 text-base leading-relaxed text-[#6B7280]">
            {skill.description}
          </p>
        )}
        {(skill.forWho || skill.whatWeDo || skill.benefit) && (
          <div className="mt-4 space-y-3 border-t border-[#E5E7EB] pt-4">
            {skill.forWho && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C21D17]">Per chi</span>
                <p className="mt-0.5 text-sm text-[#6B7280]">{skill.forWho}</p>
              </div>
            )}
            {skill.whatWeDo && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C21D17]">Cosa facciamo</span>
                <p className="mt-0.5 text-sm text-[#6B7280]">{skill.whatWeDo}</p>
              </div>
            )}
            {skill.benefit && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A537]">Il beneficio</span>
                <p className="mt-0.5 text-sm font-medium text-[#1A1A1A]">{skill.benefit}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom accent line on hover */}
      <div className="h-1 w-0 bg-[#C21D17] transition-all duration-300 ease-out group-hover:w-full" />
    </div>
  );

  if (skill.linkUrl) {
    return (
      <a href={skill.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {card}
      </a>
    );
  }
  return card;
}

export function SkillsSection({ skillsData }: SkillsSectionProps) {
  const { skills } = skillsData;

  if (!skills || skills.length === 0) return null;

  const title = skillsData.title ?? "Competenze professionali";

  return (
    <section id="servizi" className="bg-white py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Servizi
        </p>
        <h2 className="mb-16 text-center text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
          {title}
        </h2>

        <StaggerContainer className="grid gap-8 md:grid-cols-2">
          {skills.map((skill, index) => (
            <StaggerItem key={index}>
              <SkillCard skill={skill} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
