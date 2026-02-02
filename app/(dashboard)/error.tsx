"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center pt-6 text-center">
          <AlertTriangle className="mb-4 h-10 w-10 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">
            Errore nel caricamento
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Si e verificato un errore. Riprova o torna alla dashboard.
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Dashboard
            </Button>
            <Button onClick={reset}>Riprova</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
