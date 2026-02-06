"use client";

import { Check } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

interface Phase {
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
}

interface Tool {
  name: string;
  description: string;
}

interface MethodData {
  title?: string;
  subtitle?: string;
  phases: Phase[];
  tools?: Tool[];
}

interface MethodSectionProps {
  methodData: MethodData;
}

export function MethodSection({ methodData }: MethodSectionProps) {
  const { phases, tools } = methodData;
  if (!phases || phases.length === 0) return null;

  const title = methodData.title ?? "Il Mio Metodo";

  return (
    <section id="metodo" className="section-light py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Metodo
        </p>
        <h2 className="mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
          {title}
        </h2>
        {methodData.subtitle && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-[#6B7280]">
            {methodData.subtitle}
          </p>
        )}

        {/* Phases grid */}
        <StaggerContainer
          className={`grid gap-8 ${
            phases.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {phases.map((phase, i) => (
            <StaggerItem key={i}>
              <div className="h-full rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#C21D17] text-sm font-bold text-white">
                  {i + 1}
                </div>
                {phase.subtitle && (
                  <p
                    className="mb-1 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--generali-gold, #D4A537)" }}
                  >
                    {phase.subtitle}
                  </p>
                )}
                <h3 className="mb-3 text-xl font-bold text-[#1A1A1A]">
                  {phase.title}
                </h3>
                <p className="mb-4 text-base leading-relaxed text-[#6B7280]">
                  {phase.description}
                </p>
                {phase.bullets && phase.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {phase.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#C21D17]">
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-sm text-[#6B7280]">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Tools section */}
        {tools && tools.length > 0 && (
          <div className="mt-20">
            <h3 className="mb-10 text-center text-2xl font-bold text-[#1A1A1A]">
              Strumenti
            </h3>
            <StaggerContainer
              className={`grid gap-6 ${
                tools.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {tools.map((tool, i) => (
                <StaggerItem key={i}>
                  <div className="rounded-xl border-l-4 border-[#C21D17] bg-[#F9FAFB] p-6">
                    <h4 className="mb-2 font-bold text-[#1A1A1A]">{tool.name}</h4>
                    <p className="text-sm leading-relaxed text-[#6B7280]">{tool.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </section>
  );
}
