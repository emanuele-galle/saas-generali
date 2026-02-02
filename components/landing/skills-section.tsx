"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

interface Skill {
  name: string;
  description?: string;
}

interface SkillsData {
  title?: string;
  skills: Skill[];
}

interface SkillsSectionProps {
  skillsData: SkillsData;
}

export function SkillsSection({ skillsData }: SkillsSectionProps) {
  const { skills } = skillsData;

  if (!skills || skills.length === 0) {
    return null;
  }

  const title = skillsData.title ?? "Competenze professionali";

  return (
    <section id="competenze" className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <StaggerItem key={index}>
              <Card className="border-l-4 border-l-primary transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    {skill.name}
                  </h3>
                  {skill.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {skill.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
