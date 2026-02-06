"use client";

import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

interface ProcessData {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  steps: { title: string; description: string }[];
}

interface ProcessSectionProps {
  processData: ProcessData;
}

export function ProcessSection({ processData }: ProcessSectionProps) {
  const { steps } = processData;
  if (!steps || steps.length === 0) return null;

  const title = processData.title ?? "Come Lavoriamo Insieme";

  return (
    <section id="processo" className="section-dark py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          Processo
        </p>
        <h2 className="mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-white">
          {title}
        </h2>
        {processData.subtitle && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-white/60">
            {processData.subtitle}
          </p>
        )}

        <StaggerContainer className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-8" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div className="relative flex gap-6 md:gap-8">
                  {/* Number circle */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C21D17] text-lg font-bold text-white shadow-lg shadow-[#C21D17]/20 md:h-16 md:w-16 md:text-xl">
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2 pt-2 md:pt-4">
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="mt-2 text-base leading-relaxed text-white/60">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {processData.ctaText && (
          <div className="mt-16 text-center">
            <a
              href={processData.ctaLink ?? "#contatti"}
              className="inline-block rounded-full bg-[#C21D17] px-8 py-4 text-lg font-bold text-white transition-colors duration-200 hover:bg-[#E8312B]"
            >
              {processData.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
