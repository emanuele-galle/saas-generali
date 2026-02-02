import { Linkedin, Facebook, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FooterProps {
  linkedinUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
}

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Note legali", href: "/legal" },
  { label: "Cookie Policy", href: "/cookies" },
] as const;

export function LandingFooter({
  linkedinUrl,
  facebookUrl,
  twitterUrl,
}: FooterProps) {
  const hasSocialLinks = linkedinUrl || facebookUrl || twitterUrl;

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="text-lg font-semibold text-white">
              Generali
            </span>
          </div>

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="flex items-center gap-4">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Legal Links */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <nav className="flex flex-wrap items-center gap-4 md:gap-6">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Generali Italia S.p.A.
          </p>
        </div>
      </div>
    </footer>
  );
}
