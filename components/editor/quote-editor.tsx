"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuoteData {
  text?: string;
  author?: string;
  style?: "centered" | "left-accent";
}

interface QuoteEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export function QuoteEditor({ data, onChange }: QuoteEditorProps) {
  const { register, watch, setValue } = useForm<QuoteData>({
    defaultValues: {
      text: data.text ?? "",
      author: data.author ?? "",
      style: data.style ?? "centered",
    },
  });

  const style = watch("style");

  useEffect(() => {
    const subscription = watch((values) => {
      onChange({
        text: values.text || undefined,
        author: values.author || undefined,
        style: values.style ?? "centered",
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="quote-text">Citazione / Motto</Label>
        <Textarea
          id="quote-text"
          placeholder="La tua citazione o motto..."
          rows={3}
          {...register("text")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote-author">Autore (opzionale)</Label>
        <Input
          id="quote-author"
          placeholder="Nome autore"
          {...register("author")}
        />
        <p className="text-xs text-muted-foreground">
          Se vuoto, non viene mostrata l&apos;attribuzione.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Stile</Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setValue("style", "centered")}
            className={`flex-1 rounded-lg border-2 p-3 text-center text-sm transition-colors ${
              style === "centered"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/30"
            }`}
          >
            <span className="block text-xs font-medium">Centrato</span>
            <span className="block text-xs text-muted-foreground">Grande e centrato</span>
          </button>
          <button
            type="button"
            onClick={() => setValue("style", "left-accent")}
            className={`flex-1 rounded-lg border-2 p-3 text-center text-sm transition-colors ${
              style === "left-accent"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/30"
            }`}
          >
            <span className="block text-xs font-medium">Accento sinistro</span>
            <span className="block text-xs text-muted-foreground">Con barra laterale</span>
          </button>
        </div>
      </div>
    </div>
  );
}
