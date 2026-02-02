import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface FocusArticle {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  linkUrl: string;
}

interface FocusOnData {
  title?: string;
  articles: FocusArticle[];
}

interface FocusOnSectionProps {
  focusOnData: FocusOnData;
}

export function FocusOnSection({ focusOnData }: FocusOnSectionProps) {
  const { articles } = focusOnData;

  if (!articles || articles.length === 0) {
    return null;
  }

  const title = focusOnData.title ?? "Focus On";

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg">
                {article.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                {article.excerpt && (
                  <CardContent className="pb-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {article.excerpt}
                    </p>
                  </CardContent>
                )}
                <CardContent className="pt-0">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary-dark">
                    Leggi di più
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
