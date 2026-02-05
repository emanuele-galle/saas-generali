"use client";

import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
}

interface ExperiencesData {
  title?: string;
  experiences: Experience[];
}

interface ExperiencesSectionProps {
  experiencesData: ExperiencesData;
}

export function ExperiencesSection({
  experiencesData,
}: ExperiencesSectionProps) {
  const { experiences } = experiencesData;

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const title = experiencesData.title ?? "Esperienze professionali";

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em]" style={{ color: "var(--generali-gold, #D4A537)" }}>
          Percorso
        </p>
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {title}
        </h2>

        <div className="mx-auto max-w-3xl">
          <StaggerContainer className="relative border-l-2 border-[var(--theme-color,#C21D17)]/20 pl-8">
            {experiences.map((exp, index) => (
              <StaggerItem
                key={index}
                className="relative mb-10 last:mb-0"
              >
                <div
                  className="absolute -left-[calc(2rem+5px)] top-1.5 h-3 w-3 rounded-full shadow-[0_0_8px_var(--theme-color,#C21D17)]"
                  style={{ backgroundColor: "var(--theme-color, #C21D17)" }}
                />

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--theme-color,#C21D17)]">
                    {exp.period}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {exp.role}
                  </h3>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
