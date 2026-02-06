import type { Consultant, LandingPage, Prisma } from "@prisma/client";
import Script from "next/script";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { CoverSection } from "@/components/landing/cover-section";
import { SummarySection } from "@/components/landing/summary-section";
import { SkillsSection } from "@/components/landing/skills-section";
import { InterestsSection } from "@/components/landing/interests-section";
import { BannerSection } from "@/components/landing/banner-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { VideoSection } from "@/components/landing/video-section";
import { ExperiencesSection } from "@/components/landing/experiences-section";
import { QuoteSection } from "@/components/landing/quote-section";
import { ValuesSection } from "@/components/landing/values-section";
import { ProcessSection } from "@/components/landing/process-section";
import { MethodSection } from "@/components/landing/method-section";
import { StrengthsSection } from "@/components/landing/strengths-section";
import { FaqSection } from "@/components/landing/faq-section";
import { ContactForm } from "@/components/landing/contact-form";
import { AnimateOnScroll, ScrollProgress } from "@/components/landing/animate-on-scroll";

interface LandingLayoutProps {
  consultant: Consultant;
  landingPage: LandingPage;
}

function isJsonObject(
  value: Prisma.JsonValue | null
): value is Prisma.JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function LandingLayout({ consultant, landingPage }: LandingLayoutProps) {
  const consultantFullName = [
    consultant.title,
    consultant.firstName,
    consultant.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const themeColor = consultant.themeColor || "#C21D17";

  const address = [consultant.address, consultant.cap, consultant.city, consultant.province]
    .filter(Boolean)
    .join(", ");

  const hasSummary = isJsonObject(landingPage.summaryData);
  const hasSkills = isJsonObject(landingPage.skillsData);
  const hasInterests = isJsonObject(landingPage.interestsData);
  const hasBanner = isJsonObject(landingPage.bannerData);
  const hasPortfolio = isJsonObject(landingPage.portfolioData);
  const hasFocusOn = isJsonObject(landingPage.focusOnData);
  const hasTestimonials = isJsonObject(landingPage.testimonialsData);
  const hasVideo = isJsonObject(landingPage.videoData);
  const hasExperiences = isJsonObject(landingPage.experiencesData);
  const hasEducation = isJsonObject(landingPage.educationData);
  const hasQuote = isJsonObject(landingPage.quoteData);
  const hasMap = isJsonObject(landingPage.mapData);
  const hasValues = isJsonObject(landingPage.valuesData);
  const hasProcess = isJsonObject(landingPage.processData);
  const hasMethod = isJsonObject(landingPage.methodData);
  const hasStrengths = isJsonObject(landingPage.strengthsData);
  const hasFaq = isJsonObject(landingPage.faqData);

  // JSON-LD Person structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: consultantFullName,
    jobTitle: consultant.role,
    worksFor: {
      "@type": "Organization",
      name: "Generali Italia",
      url: "https://www.generali.it",
    },
    email: consultant.email,
    ...(consultant.phone && { telephone: consultant.phone }),
    ...(consultant.profileImage && { image: consultant.profileImage }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: consultant.address,
        postalCode: consultant.cap,
        addressLocality: consultant.city,
        addressRegion: consultant.province,
        addressCountry: "IT",
      },
    }),
    sameAs: [
      consultant.linkedinUrl,
      consultant.facebookUrl,
      consultant.twitterUrl,
      consultant.instagramUrl,
      consultant.youtubeUrl,
      consultant.websiteUrl,
    ].filter(Boolean),
  };

  const ga4Id = landingPage.ga4MeasurementId;

  return (
    <div style={{ "--theme-color": themeColor } as React.CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      )}
      <ScrollProgress />
      <LandingHeader consultant={consultant} />

      <main>
        {/* 1. Hero */}
        <CoverSection
          consultant={consultant}
          coverData={
            isJsonObject(landingPage.coverData)
              ? (landingPage.coverData as Parameters<typeof CoverSection>[0]["coverData"])
              : {}
          }
        />

        {/* 2. Valori */}
        {hasValues && (
          <AnimateOnScroll variant="fade-up">
            <ValuesSection
              valuesData={landingPage.valuesData as unknown as Parameters<typeof ValuesSection>[0]["valuesData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 3. Chi Sono */}
        {hasSummary && (
          <SummarySection
            summaryData={landingPage.summaryData as unknown as Parameters<typeof SummarySection>[0]["summaryData"]}
            consultant={consultant}
          />
        )}

        {/* 3. Servizi */}
        {hasSkills && (
          <AnimateOnScroll variant="fade-up">
            <SkillsSection
              skillsData={landingPage.skillsData as unknown as Parameters<typeof SkillsSection>[0]["skillsData"]}
            />
          </AnimateOnScroll>
        )}

        {/* Process */}
        {hasProcess && (
          <AnimateOnScroll variant="fade-up">
            <ProcessSection
              processData={landingPage.processData as unknown as Parameters<typeof ProcessSection>[0]["processData"]}
            />
          </AnimateOnScroll>
        )}

        {/* Method */}
        {hasMethod && (
          <AnimateOnScroll variant="fade-up">
            <MethodSection
              methodData={landingPage.methodData as unknown as Parameters<typeof MethodSection>[0]["methodData"]}
            />
          </AnimateOnScroll>
        )}

        {/* Strengths */}
        {hasStrengths && (
          <AnimateOnScroll variant="fade-up">
            <StrengthsSection
              strengthsData={landingPage.strengthsData as unknown as Parameters<typeof StrengthsSection>[0]["strengthsData"]}
            />
          </AnimateOnScroll>
        )}

        {/* Interessi */}
        {hasInterests && (
          <AnimateOnScroll variant="fade-up">
            <InterestsSection
              interestsData={landingPage.interestsData as unknown as Parameters<typeof InterestsSection>[0]["interestsData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 5. Banner */}
        {hasBanner && (
          <AnimateOnScroll variant="fade-up">
            <BannerSection
              bannerData={landingPage.bannerData as unknown as Parameters<typeof BannerSection>[0]["bannerData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 6. Portfolio (merge with focusOn) */}
        {(hasPortfolio || hasFocusOn) && (
          <AnimateOnScroll variant="fade-up">
            <PortfolioSection
              portfolioData={
                hasPortfolio
                  ? (landingPage.portfolioData as unknown as Parameters<typeof PortfolioSection>[0]["portfolioData"])
                  : undefined
              }
              focusOnData={
                hasFocusOn
                  ? (landingPage.focusOnData as unknown as NonNullable<Parameters<typeof PortfolioSection>[0]["focusOnData"]>)
                  : undefined
              }
            />
          </AnimateOnScroll>
        )}

        {/* 7. Testimonial */}
        {hasTestimonials && (
          <AnimateOnScroll variant="fade-up">
            <TestimonialsSection
              testimonialsData={landingPage.testimonialsData as unknown as Parameters<typeof TestimonialsSection>[0]["testimonialsData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 8. Video */}
        {hasVideo && (
          <AnimateOnScroll variant="fade-up">
            <VideoSection
              videoData={landingPage.videoData as unknown as Parameters<typeof VideoSection>[0]["videoData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 9. Percorso (merge experiences + education) */}
        {(hasExperiences || hasEducation) && (
          <AnimateOnScroll variant="fade-up">
            <ExperiencesSection
              experiencesData={
                hasExperiences
                  ? (landingPage.experiencesData as unknown as Parameters<typeof ExperiencesSection>[0]["experiencesData"])
                  : undefined
              }
              educationData={
                hasEducation
                  ? (landingPage.educationData as unknown as NonNullable<Parameters<typeof ExperiencesSection>[0]["educationData"]>)
                  : undefined
              }
            />
          </AnimateOnScroll>
        )}

        {/* FAQ */}
        {hasFaq && (
          <AnimateOnScroll variant="fade-up">
            <FaqSection
              faqData={landingPage.faqData as unknown as Parameters<typeof FaqSection>[0]["faqData"]}
            />
          </AnimateOnScroll>
        )}

        {/* Citazione */}
        {hasQuote && (
          <QuoteSection
            quoteData={landingPage.quoteData as unknown as Parameters<typeof QuoteSection>[0]["quoteData"]}
          />
        )}

        {/* 11. Contatti */}
        <AnimateOnScroll variant="fade-up">
          <ContactForm
            landingPageId={landingPage.id}
            consultantName={consultantFullName}
            consultantEmail={consultant.email}
            consultantPhone={consultant.phone ?? undefined}
            consultantImage={consultant.profileImage}
            consultantRole={consultant.role}
            consultantAddress={address || undefined}
            mapData={
              hasMap
                ? (landingPage.mapData as unknown as Parameters<typeof ContactForm>[0]["mapData"])
                : undefined
            }
          />
        </AnimateOnScroll>
      </main>

      {/* 12. Footer */}
      <LandingFooter
        consultantName={consultantFullName}
        consultantRole={consultant.role}
        linkedinUrl={consultant.linkedinUrl}
        facebookUrl={consultant.facebookUrl}
        twitterUrl={consultant.twitterUrl}
        instagramUrl={consultant.instagramUrl}
        youtubeUrl={consultant.youtubeUrl}
        websiteUrl={consultant.websiteUrl}
      />
    </div>
  );
}
