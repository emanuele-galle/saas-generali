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
        {/* 1. Cover */}
        <CoverSection
          consultant={consultant}
          coverData={
            isJsonObject(landingPage.coverData)
              ? (landingPage.coverData as Parameters<typeof CoverSection>[0]["coverData"])
              : {}
          }
        />

        {/* 2. Profile */}
        <ProfileSection consultant={consultant} />

        {/* 3. Map */}
        {isJsonObject(landingPage.mapData) && (
          <MapSection
            mapData={landingPage.mapData as unknown as Parameters<typeof MapSection>[0]["mapData"]}
          />
        )}

        {/* 4. Summary */}
        {isJsonObject(landingPage.summaryData) && (
          <SummarySection
            summaryData={landingPage.summaryData as unknown as Parameters<typeof SummarySection>[0]["summaryData"]}
          />
        )}

        {/* 5. Skills */}
        {isJsonObject(landingPage.skillsData) && (
          <SkillsSection
            skillsData={landingPage.skillsData as unknown as Parameters<typeof SkillsSection>[0]["skillsData"]}
          />
        )}

        {/* 6. Experiences */}
        {isJsonObject(landingPage.experiencesData) && (
          <ExperiencesSection
            experiencesData={landingPage.experiencesData as unknown as Parameters<typeof ExperiencesSection>[0]["experiencesData"]}
          />
        )}

        {/* 7. Education */}
        {isJsonObject(landingPage.educationData) && (
          <EducationSection
            educationData={landingPage.educationData as unknown as Parameters<typeof EducationSection>[0]["educationData"]}
          />
        )}

        {/* 8. Interests */}
        {isJsonObject(landingPage.interestsData) && (
          <InterestsSection
            interestsData={landingPage.interestsData as unknown as Parameters<typeof InterestsSection>[0]["interestsData"]}
          />
        )}

        {/* 9. Banner */}
        {isJsonObject(landingPage.bannerData) && (
          <BannerSection
            bannerData={landingPage.bannerData as unknown as Parameters<typeof BannerSection>[0]["bannerData"]}
          />
        )}

        {/* 10. Focus On */}
        {isJsonObject(landingPage.focusOnData) && (
          <FocusOnSection
            focusOnData={landingPage.focusOnData as unknown as Parameters<typeof FocusOnSection>[0]["focusOnData"]}
          />
        )}

        {/* Contact Form */}
        <ContactForm
          landingPageId={landingPage.id}
          consultantName={consultantFullName}
        />
      </main>

      <LandingFooter
        linkedinUrl={consultant.linkedinUrl}
        facebookUrl={consultant.facebookUrl}
        twitterUrl={consultant.twitterUrl}
      />
    </>
  );
}
