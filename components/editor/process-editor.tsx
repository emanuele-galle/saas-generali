"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ProcessData {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  steps: { title: string; description: string }[];
}

interface ProcessFormValues {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  steps: Array<{ title: string; description: string }>;
}

interface ProcessEditorProps {
  data: ProcessData;
  onChange: (data: ProcessData) => void;
}

function toFormValues(data: ProcessData): ProcessFormValues {
  return {
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    ctaText: data.ctaText ?? "",
    ctaLink: data.ctaLink ?? "",
    steps: (data.steps ?? []).map((s) => ({
      title: s.title,
      description: s.description,
    })),
  };
}

function toProcessData(values: ProcessFormValues): ProcessData {
  return {
    title: values.title || undefined,
    subtitle: values.subtitle || undefined,
    ctaText: values.ctaText || undefined,
    ctaLink: values.ctaLink || undefined,
    steps: values.steps
      .filter((s) => s.title.trim() !== "")
      .map((s) => ({
        title: s.title,
        description: s.description,
      })),
  };
}

export function ProcessEditor({ data, onChange }: ProcessEditorProps) {
  const { register, control, watch } = useForm<ProcessFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toProcessData(values as ProcessFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="process-title">Titolo sezione</Label>
        <Input
          id="process-title"
          placeholder="Es. Come Lavoriamo Insieme"
          {...register("title")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="process-subtitle">Sottotitolo (opzionale)</Label>
        <Input
          id="process-subtitle"
          placeholder="Es. Un percorso chiaro in 5 passi"
          {...register("subtitle")}
        />
      </div>

      <Label>Step del processo</Label>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Step {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Input
            placeholder="Titolo step"
            {...register(`steps.${index}.title`)}
          />
          <Textarea
            placeholder="Descrizione"
            rows={2}
            {...register(`steps.${index}.description`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ title: "", description: "" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi step
      </Button>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="process-cta">Testo CTA (opzionale)</Label>
        <Input
          id="process-cta"
          placeholder="Es. Iniziamo dal primo passo"
          {...register("ctaText")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="process-cta-link">Link CTA (opzionale)</Label>
        <Input
          id="process-cta-link"
          placeholder="Es. #contatti"
          {...register("ctaLink")}
        />
      </div>
    </div>
  );
}
