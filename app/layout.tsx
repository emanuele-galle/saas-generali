import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://saas-generali.fodivps1.cloud'),
  title: {
    default: "Saas Generali - Gestione Landing Page Consulenti",
    template: "%s | Saas Generali",
  },
  description:
    "Piattaforma di gestione landing page personali per i consulenti del Gruppo Generali.",
  icons: {
    icon: "/images/generali-logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Saas Generali",
    title: "Saas Generali - Gestione Landing Page Consulenti",
    description:
      "Piattaforma di gestione landing page personali per i consulenti del Gruppo Generali.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
