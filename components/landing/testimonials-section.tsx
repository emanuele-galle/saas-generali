import Image from "next/image";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  imageUrl?: string;
}

interface TestimonialsSectionProps {
  testimonialsData: {
    testimonials?: Testimonial[];
  };
}

export function TestimonialsSection({ testimonialsData }: TestimonialsSectionProps) {
  const testimonials = testimonialsData.testimonials ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="relative bg-[#111111] py-20 sm:py-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, var(--theme-color, #c21d17), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em]" style={{ color: "var(--generali-gold, #D4A537)" }}>
          Testimonianze
        </p>
        <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
          Cosa dicono i clienti
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-all hover:border-[var(--theme-color,#C21D17)]/30 hover:bg-white/[0.07] hover:shadow-[0_0_30px_-10px_var(--theme-color,#C21D17)]"
            >
              <Quote className="absolute right-6 top-6 h-12 w-12 text-[var(--theme-color,#C21D17)]/[0.08]" />

              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s < t.rating
                        ? "fill-[var(--generali-gold,#D4A537)] text-[var(--generali-gold,#D4A537)]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              <p className="mb-8 text-base leading-relaxed text-white/75">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                {t.imageUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
                    <Image
                      src={t.imageUrl}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--theme-color,#C21D17)]/20 text-lg font-bold text-[var(--theme-color,#C21D17)]">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  {t.role && (
                    <p className="text-sm text-white/50">{t.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
