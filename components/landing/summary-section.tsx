import { CheckCircle2 } from "lucide-react";

interface SummaryData {
  bio?: string;
  highlights?: string[];
}

interface SummarySectionProps {
  summaryData: SummaryData;
}

export function SummarySection({ summaryData }: SummarySectionProps) {
  const { bio, highlights } = summaryData;

  if (!bio && (!highlights || highlights.length === 0)) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
            Chi sono
          </h2>

          {bio && (
            <div className="mb-8 space-y-4">
              {bio.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {highlights && highlights.length > 0 && (
            <ul className="space-y-3">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
