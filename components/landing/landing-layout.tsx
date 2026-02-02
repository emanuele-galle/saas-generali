import type { Consultant, LandingPage, Prisma } from "@prisma/client";
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
import { ContactForm } from "@/components/landing/contact-form";
import { AnimateOnScroll } from "@/components/landing/animate-on-scroll";

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

  return (
    <>
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
        <AnimateOnScroll>
          <ProfileSection consultant={consultant} />
        </AnimateOnScroll>

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
          <AnimateOnScroll>
            <SummarySection
              summaryData={landingPage.summaryData as unknown as Parameters<typeof SummarySection>[0]["summaryData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 5. Skills */}
        {isJsonObject(landingPage.skillsData) && (
          <AnimateOnScroll>
            <SkillsSection
              skillsData={landingPage.skillsData as unknown as Parameters<typeof SkillsSection>[0]["skillsData"]}
            />
          </AnimateOnScroll>
        )}

        {/* 6. Experiences */}
        {isJsonObject(landingPage.experiencesData) && (
          <AnimateOnScroll>
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

        {/* Contact Form */}
        <AnimateOnScroll>
          <ContactForm
            landingPageId={landingPage.id}
            consultantName={consultantFullName}
          />
        </AnimateOnScroll>
      </main>

      <LandingFooter
        linkedinUrl={consultant.linkedinUrl}
        facebookUrl={consultant.facebookUrl}
        twitterUrl={consultant.twitterUrl}
      />
    </>
  );
}
