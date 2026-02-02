import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { LandingLayout } from "@/components/landing/landing-layout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const landingPage = await db.landingPage.findUnique({
    where: { slug },
    include: {
      consultant: {
        select: {
          firstName: true,
          lastName: true,
          title: true,
          role: true,
          profileImage: true,
        },
      },
    },
  });

  if (!landingPage || landingPage.status !== "PUBLISHED") {
    return { title: "Pagina non trovata" };
  }

  const { consultant } = landingPage;
  const fullName = [consultant.title, consultant.firstName, consultant.lastName]
    .filter(Boolean)
    .join(" ");

  const title =
    landingPage.metaTitle ?? `${fullName} - ${consultant.role} | Generali`;
  const description =
    landingPage.metaDescription ??
    `Pagina personale di ${fullName}, ${consultant.role} presso Generali Italia.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(consultant.profileImage
        ? {
            images: [
              {
                url: consultant.profileImage,
                width: 400,
                height: 400,
                alt: fullName,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;

  const landingPage = await db.landingPage.findUnique({
    where: { slug },
    include: { consultant: true },
  });

  if (!landingPage || landingPage.status !== "PUBLISHED") {
    notFound();
  }

  // Increment view count without blocking the response
  db.landingPage
    .update({
      where: { id: landingPage.id },
      data: {
        views: { increment: 1 },
        lastViewedAt: new Date(),
      },
    })
    .catch(() => {
      // Silently ignore view count errors
    });

  return (
    <LandingLayout
      consultant={landingPage.consultant}
      landingPage={landingPage}
    />
  );
}
