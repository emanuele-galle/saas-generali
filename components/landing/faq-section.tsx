"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

interface FaqData {
  title?: string;
  subtitle?: string;
  items: { question: string; answer: string }[];
}

interface FaqSectionProps {
  faqData: FaqData;
}

export function FaqSection({ faqData }: FaqSectionProps) {
  const { items } = faqData;
  if (!items || items.length === 0) return null;

  const title = faqData.title ?? "Domande Frequenti";

  return (
    <section id="faq" className="section-light py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--generali-gold, #D4A537)" }}
        >
          FAQ
        </p>
        <h2 className="mb-6 text-center text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-[#1A1A1A]">
          {title}
        </h2>
        {faqData.subtitle && (
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-[#6B7280]">
            {faqData.subtitle}
          </p>
        )}

        <StaggerContainer>
          <Accordion.Root type="single" collapsible className="space-y-4">
            {items.map((item, i) => (
              <StaggerItem key={i}>
                <Accordion.Item
                  value={`faq-${i}`}
                  className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm"
                >
                  <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-5 text-left text-lg font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F9FAFB] [&[data-state=open]>svg]:rotate-180">
                    {item.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#9CA3AF] transition-transform duration-200" />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="border-t border-[#E5E7EB] px-6 py-5">
                      <p className="text-base leading-relaxed text-[#6B7280]">
                        {item.answer}
                      </p>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </StaggerItem>
            ))}
          </Accordion.Root>
        </StaggerContainer>
      </div>
    </section>
  );
}
