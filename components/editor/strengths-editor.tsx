"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StrengthsData {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  items: { title: string; description: string; icon?: string }[];
}

interface StrengthsFormValues {
  title: string;
  subtitle: string;
  videoUrl: string;
  items: Array<{ title: string; description: string; icon: string }>;
}

interface StrengthsEditorProps {
  data: StrengthsData;
  onChange: (data: StrengthsData) => void;
}

function toFormValues(data: StrengthsData): StrengthsFormValues {
  return {
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    videoUrl: data.videoUrl ?? "",
    items: (data.items ?? []).map((item) => ({
      title: item.title,
      description: item.description,
      icon: item.icon ?? "",
    })),
  };
}

function toStrengthsData(values: StrengthsFormValues): StrengthsData {
  return {
    title: values.title || undefined,
    subtitle: values.subtitle || undefined,
    videoUrl: values.videoUrl || undefined,
    items: values.items
      .filter((item) => item.title.trim() !== "")
      .map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon || undefined,
      })),
  };
}

export function StrengthsEditor({ data, onChange }: StrengthsEditorProps) {
  const { register, control, watch } = useForm<StrengthsFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toStrengthsData(values as StrengthsFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="strengths-title">Titolo sezione</Label>
        <Input
          id="strengths-title"
          placeholder="Es. Perche Scegliermi"
          {...register("title")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="strengths-subtitle">Sottotitolo (opzionale)</Label>
        <Input
          id="strengths-subtitle"
          placeholder="Es. I vantaggi di lavorare insieme"
          {...register("subtitle")}
        />
      </div>

      <Label>Punti di forza</Label>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Punto {index + 1}
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
            placeholder="Titolo"
            {...register(`items.${index}.title`)}
          />
          <Textarea
            placeholder="Descrizione"
            rows={3}
            {...register(`items.${index}.description`)}
          />
          <Input
            placeholder="Icona Lucide (opzionale, es. Shield, Award)"
            {...register(`items.${index}.icon`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ title: "", description: "", icon: "" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi punto di forza
      </Button>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="strengths-video">Video correlato (opzionale)</Label>
        <Input
          id="strengths-video"
          placeholder="URL YouTube o Vimeo (es. https://youtube.com/watch?v=...)"
          {...register("videoUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Se presente, il video viene mostrato nella sezione.
        </p>
      </div>
    </div>
  );
}
