import type { Consultant, LandingPage, Prisma } from "@prisma/client";
import Script from "next/script";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { CoverSection } from "@/components/landing/cover-section";
import { ProfileSection } from "@/components/landing/profile-section";
import { MapSection } from "@/components/landing/map-section";
import { SummarySection } from "@/components/landing/summary-section";
import { SkillsSection } from "@/components/landing/skills-section";
import { ExperiencesSection } from "@/components/landing/experiences-section";
import { EducationSection } from "@/components/landing/education-section";
import { InterestsSection } from "@/components/landing/interests-section";
import { BannerSection } from "@/components/landing/banner-section";
import { FocusOnSection } from "@/components/landing/focus-on-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { VideoSection } from "@/components/landing/video-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { QuoteSection } from "@/components/landing/quote-section";
import { ContactForm } from "@/components/landing/contact-form";
import { AnimateOnScroll, ScrollProgress } from "@/components/landing/animate-on-scroll";
import { SectionDivider } from "@/components/landing/section-divider";

interface LandingLayoutProps {
  consultant: Consultant;
  landingPage: LandingPage;
}

// Helper to safely check if a Prisma JSON value is a non-null object
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
      <LandingHeader />

      <main>
        {/* 1. Cover - no animation wrapper, has its own */}
        <CoverSection
          consultant={consultant}
          coverData={
            isJsonObject(landingPage.coverData)
              ? (landingPage.coverData as Parameters<typeof CoverSection>[0]["coverData"])
              : {}
          }
        />

        {/* 2. Profile */}
        <AnimateOnScroll variant="fade-up">
          <ProfileSection consultant={consultant} />
        </AnimateOnScroll>

        <SectionDivider className="py-4" />

        {/* 3. Map */}
        {isJsonObject(landingPage.mapData) && (
          <AnimateOnScroll>
            <MapSection
              mapData={landingPage.mapData as unknown as Parameters<typeof MapSection>[0]["mapData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 4. Summary */}
        {isJsonObject(landingPage.summaryData) && (
          <AnimateOnScroll variant="blur">
            <SummarySection
              summaryData={landingPage.summaryData as unknown as Parameters<typeof SummarySection>[0]["summaryData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 5. Skills */}
        {isJsonObject(landingPage.skillsData) && (
          <AnimateOnScroll variant="scale">
            <SkillsSection
              skillsData={landingPage.skillsData as unknown as Parameters<typeof SkillsSection>[0]["skillsData"]}
            />
          </AnimateOnScroll>
        )}

        <SectionDivider className="py-4" />

        {/* 6. Experiences */}
        {isJsonObject(landingPage.experiencesData) && (
          <AnimateOnScroll variant="fade-left">
            <ExperiencesSection
              experiencesData={landingPage.experiencesData as unknown as Parameters<typeof ExperiencesSection>[0]["experiencesData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 7. Education */}
        {isJsonObject(landingPage.educationData) && (
          <AnimateOnScroll>
            <EducationSection
              educationData={landingPage.educationData as unknown as Parameters<typeof EducationSection>[0]["educationData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 8. Interests */}
        {isJsonObject(landingPage.interestsData) && (
          <AnimateOnScroll>
            <InterestsSection
              interestsData={landingPage.interestsData as unknown as Parameters<typeof InterestsSection>[0]["interestsData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 9. Banner */}
        {isJsonObject(landingPage.bannerData) && (
          <AnimateOnScroll>
            <BannerSection
              bannerData={landingPage.bannerData as unknown as Parameters<typeof BannerSection>[0]["bannerData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 10. Focus On */}
        {isJsonObject(landingPage.focusOnData) && (
          <AnimateOnScroll>
            <FocusOnSection
              focusOnData={landingPage.focusOnData as unknown as Parameters<typeof FocusOnSection>[0]["focusOnData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 11. Testimonials */}
        {isJsonObject(landingPage.testimonialsData) && (
          <AnimateOnScroll variant="fade-right">
            <TestimonialsSection
              testimonialsData={landingPage.testimonialsData as unknown as Parameters<typeof TestimonialsSection>[0]["testimonialsData"]}
            />
          </AnimateOnScroll>
        )}

        <SectionDivider className="py-4" />

        {/* 12. Video */}
        {isJsonObject(landingPage.videoData) && (
          <AnimateOnScroll>
            <VideoSection
              videoData={landingPage.videoData as unknown as Parameters<typeof VideoSection>[0]["videoData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 13. Portfolio */}
        {isJsonObject(landingPage.portfolioData) && (
          <AnimateOnScroll>
            <PortfolioSection
              portfolioData={landingPage.portfolioData as unknown as Parameters<typeof PortfolioSection>[0]["portfolioData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 14. Quote */}
        {isJsonObject(landingPage.quoteData) && (
          <AnimateOnScroll variant="blur">
            <QuoteSection
              quoteData={landingPage.quoteData as unknown as Parameters<typeof QuoteSection>[0]["quoteData"]}
            />
          </AnimateOnScroll>
        )}

        {/* Contact Form */}
        <AnimateOnScroll>
          <ContactForm
            landingPageId={landingPage.id}
            consultantName={consultantFullName}
            consultantEmail={consultant.email}
            consultantPhone={consultant.phone ?? undefined}
            consultantImage={consultant.profileImage}
            consultantRole={consultant.role}
          />
        </AnimateOnScroll>
      </main>

      <LandingFooter
        consultantName={consultantFullName}
        consultantRole={consultant.role}
        consultantEmail={consultant.email}
        consultantPhone={consultant.phone ?? undefined}
        consultantAddress={
          [consultant.address, consultant.cap, consultant.city, consultant.province]
            .filter(Boolean)
            .join(", ") || undefined
        }
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
