"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoverData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  backgroundImage?: string;
}

interface CoverEditorProps {
  data: CoverData;
  onChange: (data: CoverData) => void;
}

export function CoverEditor({ data, onChange }: CoverEditorProps) {
  const { register, watch } = useForm<CoverData>({
    defaultValues: data,
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(values as CoverData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cover-headline">Titolo principale</Label>
        <Input
          id="cover-headline"
          placeholder='Es. "Benvenuto, sono Dott. Mario Rossi"'
          {...register("headline")}
        />
        <p className="text-xs text-muted-foreground">
          Se vuoto, viene generato automaticamente dal nome del consulente.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-subheadline">Sottotitolo</Label>
        <Input
          id="cover-subheadline"
          placeholder="Es. Il tuo consulente finanziario di fiducia"
          {...register("subheadline")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-cta">Testo pulsante CTA</Label>
        <Input
          id="cover-cta"
          placeholder="Es. Chiedi un appuntamento"
          {...register("ctaText")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover-bg">Immagine di sfondo (URL)</Label>
        <Input
          id="cover-bg"
          type="url"
          placeholder="https://esempio.com/immagine.jpg"
          {...register("backgroundImage")}
        />
        <p className="text-xs text-muted-foreground">
          Se vuoto, viene usato un gradiente scuro di default.
        </p>
      </div>
    </div>
  );
}
