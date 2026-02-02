"use client";

import Link from "next/link";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Eye } from "lucide-react";

export default function MyLandingPage() {
  const trpc = useTRPC();

  const { data: consultant, isLoading } = useQuery(
    trpc.consultants.getByUserId.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  if (!consultant?.landingPage) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">La mia Landing</h1>
          <p className="text-muted-foreground">
            Gestisci la tua landing page personale
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              Nessuna landing page associata al tuo profilo.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Contatta un amministratore per attivare la tua pagina.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lp = consultant.landingPage;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">La mia Landing</h1>
        <p className="text-muted-foreground">
          Gestisci la tua landing page personale
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stato Landing Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Stato</p>
              <p className="font-medium">
                {lp.status === "PUBLISHED"
                  ? "Pubblicata"
                  : lp.status === "DRAFT"
                    ? "Bozza"
                    : "Archiviata"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Slug</p>
              <p className="font-medium">{lp.slug}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visite</p>
              <p className="font-medium">{lp.views}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {lp.status === "PUBLISHED" && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={`${appUrl}/${lp.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizza Landing
                </a>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href={`/editor/${lp.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Modifica Sezioni
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
