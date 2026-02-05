"use client";

import type { ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { LANDING_SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CoverEditor } from "@/components/editor/cover-editor";
import { SummaryEditor } from "@/components/editor/summary-editor";
import { MapEditor } from "@/components/editor/map-editor";
import { SkillsEditor } from "@/components/editor/skills-editor";
import { ExperiencesEditor } from "@/components/editor/experiences-editor";
import { EducationEditor } from "@/components/editor/education-editor";
import { InterestsEditor } from "@/components/editor/interests-editor";
import { BannerEditor } from "@/components/editor/banner-editor";
import { FocusOnEditor } from "@/components/editor/focus-on-editor";
import { TestimonialsEditor } from "@/components/editor/testimonials-editor";
import { VideoEditor } from "@/components/editor/video-editor";
import { PortfolioEditor } from "@/components/editor/portfolio-editor";
import { QuoteEditor } from "@/components/editor/quote-editor";

interface ConsultantAddress {
  address?: string | null;
  cap?: string | null;
  city?: string | null;
  province?: string | null;
}

interface SectionPanelProps {
  sections: Record<string, unknown>;
  onSectionChange: (sectionId: string, data: unknown) => void;
  consultantAddress?: ConsultantAddress;
}

/**
 * Safely casts an unknown JSON value to a Record, falling back to an empty object.
 */
function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getSectionEditor(
  sectionId: string,
  data: unknown,
  onChange: (data: unknown) => void,
  consultantAddress?: ConsultantAddress,
): ReactNode {
  const record = asRecord(data);

  switch (sectionId) {
    case "cover":
      return (
        <CoverEditor
          data={record as Parameters<typeof CoverEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "summary":
      return (
        <SummaryEditor
          data={record as Parameters<typeof SummaryEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "map":
      return (
        <MapEditor
          data={record as Parameters<typeof MapEditor>[0]["data"]}
          onChange={onChange}
          consultantAddress={consultantAddress}
        />
      );
    case "skills":
      return (
        <SkillsEditor
          data={{ skills: [], ...record } as Parameters<typeof SkillsEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "experiences":
      return (
        <ExperiencesEditor
          data={{ experiences: [], ...record } as Parameters<typeof ExperiencesEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "education":
      return (
        <EducationEditor
          data={{ items: [], ...record } as Parameters<typeof EducationEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "interests":
      return (
        <InterestsEditor
          data={{ interests: [], ...record } as Parameters<typeof InterestsEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "banner":
      return (
        <BannerEditor
          data={record as Parameters<typeof BannerEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "focusOn":
      return (
        <FocusOnEditor
          data={{ articles: [], ...record } as Parameters<typeof FocusOnEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "testimonials":
      return (
        <TestimonialsEditor
          data={{ testimonials: [], ...record } as Parameters<typeof TestimonialsEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "video":
      return (
        <VideoEditor
          data={{ videos: [], ...record } as Parameters<typeof VideoEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "portfolio":
      return (
        <PortfolioEditor
          data={{ items: [], ...record } as Parameters<typeof PortfolioEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    case "quote":
      return (
        <QuoteEditor
          data={record as Parameters<typeof QuoteEditor>[0]["data"]}
          onChange={onChange}
        />
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Questa sezione viene generata automaticamente dai dati del consulente.
        </p>
      );
  }
}

export function SectionPanel({ sections, onSectionChange, consultantAddress }: SectionPanelProps) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-2">
      {LANDING_SECTIONS.map((section) => (
        <Accordion.Item
          key={section.id}
          value={section.id}
          className="overflow-hidden rounded-lg border"
        >
          <Accordion.Trigger
            className={cn(
              "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium",
              "hover:bg-muted/50 transition-colors",
              "data-[state=open]:bg-muted/50",
              "[&[data-state=open]>svg]:rotate-180",
            )}
          >
            <span>
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {section.number}
              </span>
              {section.label}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-4 pb-4 pt-2">
              {getSectionEditor(
                section.id,
                sections[section.id],
                (data) => onSectionChange(section.id, data),
                consultantAddress,
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
