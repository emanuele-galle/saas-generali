import { GraduationCap } from "lucide-react";

interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
}

interface EducationData {
  title?: string;
  items: EducationItem[];
}

interface EducationSectionProps {
  educationData: EducationData;
}

export function EducationSection({ educationData }: EducationSectionProps) {
  const { items } = educationData;

  if (!items || items.length === 0) {
    return null;
  }

  const title = educationData.title ?? "Formazione";

  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>

        <div className="mx-auto max-w-3xl space-y-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {item.degree}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.institution}
                </p>
                {item.year && (
                  <p className="mt-1 text-xs font-medium text-primary">
                    {item.year}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
