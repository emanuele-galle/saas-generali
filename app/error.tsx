"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#C21D17]">
        <span className="text-2xl font-bold text-white">G</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground">
        Qualcosa e andato storto
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Si e verificato un errore imprevisto. Riprova o contatta il supporto se
        il problema persiste.
      </p>
      <Button onClick={reset} className="mt-6">
        Riprova
      </Button>
    </div>
  );
}
