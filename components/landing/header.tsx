"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** All possible nav items — only those whose section exists in the DOM will be shown */
const ALL_NAV_ITEMS = [
  { label: "Chi Sono", href: "#chi-sono" },
  { label: "Servizi", href: "#servizi" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contatti", href: "#contatti" },
];

interface LandingHeaderProps {
  consultant?: {
    title?: string | null;
    firstName: string;
    lastName: string;
  };
}

export function LandingHeader({ consultant }: LandingHeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState(ALL_NAV_ITEMS);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On mount: detect which sections exist in the DOM and filter nav items
  useEffect(() => {
    const existing = ALL_NAV_ITEMS.filter(
      (item) => document.getElementById(item.href.slice(1)) !== null
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- filtering nav items based on DOM state on mount
    setVisibleItems(existing.length > 0 ? existing : ALL_NAV_ITEMS);
  }, []);

  // Scroll-spy: detect which section is currently in view
  useEffect(() => {
    const sectionIds = visibleItems.map((item) => item.href.slice(1));
    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        }

        // Pick the section with highest visibility, respecting DOM order for ties
        let best: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = visibleSections.get(id);
          if (ratio !== undefined && ratio >= bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActiveSection(best);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [visibleItems]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    setActiveSection(href.slice(1));
  }, []);

  const isActive = (href: string) => activeSection === href.slice(1);

  return (
    <>
      <header
        onTouchStart={() => {}}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="flex items-center"
            onClick={() => setActiveSection(null)}
          >
            <span
              className={cn(
                "font-display text-lg font-bold tracking-tight transition-all duration-500",
                scrolled ? "text-[#1A1A1A]" : "text-white"
              )}
            >
              {consultant
                ? [consultant.title, consultant.firstName, consultant.lastName]
                    .filter(Boolean)
                    .join(" ")
                : "Consulente"}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {visibleItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "relative text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300",
                  "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:transition-all after:duration-300",
                  isActive(item.href)
                    ? scrolled
                      ? "text-[#1A1A1A] after:w-full after:bg-[var(--theme-color,#C21D17)]"
                      : "text-white after:w-full after:bg-white"
                    : scrolled
                      ? "text-[#1A1A1A]/70 hover:text-[#1A1A1A] active:text-[#1A1A1A] after:w-0 after:bg-[var(--theme-color,#C21D17)] hover:after:w-full active:after:w-full"
                      : "text-white/60 hover:text-white active:text-white after:w-0 after:bg-white hover:after:w-full active:after:w-full"
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contatti"
              onClick={() => handleNavClick("#contatti")}
              className="rounded-full px-6 py-2.5 text-[13px] font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(194,29,23,0.3)] active:shadow-[0_0_20px_rgba(194,29,23,0.3)] active:scale-95"
              style={{ backgroundColor: "var(--theme-color, #C21D17)" }}
            >
              Contattami
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-md p-2 lg:hidden transition-colors",
              scrolled ? "text-[#1A1A1A]" : "text-white"
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile slide-in panel */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-display text-lg text-[#1A1A1A]">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Chiudi menu"
            >
              <X className="h-6 w-6 text-[#1A1A1A]" />
            </button>
          </div>
          <nav className="flex flex-col px-6">
            {visibleItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-[#e5e5e5] py-4 text-base font-semibold transition-colors",
                  isActive(item.href)
                    ? "text-[var(--theme-color,#C21D17)]"
                    : "text-[#1A1A1A] hover:text-[var(--theme-color,#C21D17)] active:text-[var(--theme-color,#C21D17)]"
                )}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contatti"
              className="mt-6 block rounded-full px-6 py-3 text-center text-base font-bold text-white transition-all active:scale-95"
              style={{ backgroundColor: "var(--theme-color, #C21D17)" }}
              onClick={() => handleNavClick("#contatti")}
            >
              Contattami
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
