"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";


interface Experience {
  company: string;
  role: string;
  period: string;
  description?: string;
}

interface ExperiencesData {
  experiences: Experience[];
  videoUrl?: string;
}

interface ExperiencesFormValues {
  videoUrl: string;
  experiences: Array<{
    company: string;
    role: string;
    period: string;
    description: string;
  }>;
}

interface ExperiencesEditorProps {
  data: ExperiencesData;
  onChange: (data: ExperiencesData) => void;
}

function toFormValues(data: ExperiencesData): ExperiencesFormValues {
  return {
    videoUrl: data.videoUrl ?? "",
    experiences: (data.experiences ?? []).map((e) => ({
      company: e.company,
      role: e.role,
      period: e.period,
      description: e.description ?? "",
    })),
  };
}

function toExperiencesData(values: ExperiencesFormValues): ExperiencesData {
  return {
    videoUrl: values.videoUrl || undefined,
    experiences: values.experiences
      .filter((e) => e.company.trim() !== "" || e.role.trim() !== "")
      .map((e) => ({
        company: e.company,
        role: e.role,
        period: e.period,
        description: e.description || undefined,
      })),
  };
}

export function ExperiencesEditor({ data, onChange }: ExperiencesEditorProps) {
  const { register, control, watch } = useForm<ExperiencesFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "experiences",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toExperiencesData(values as ExperiencesFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  function handleMoveUp(index: number): void {
    if (index > 0) {
      swap(index, index - 1);
    }
  }

  function handleMoveDown(index: number): void {
    if (index < fields.length - 1) {
      swap(index, index + 1);
    }
  }

  return (
    <div className="space-y-4">
      <Label>Esperienze professionali</Label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Esperienza {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="h-7 w-7 text-muted-foreground"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleMoveDown(index)}
                disabled={index === fields.length - 1}
                className="h-7 w-7 text-muted-foreground"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
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
          </div>
          <Input
            placeholder="Azienda"
            {...register(`experiences.${index}.company`)}
          />
          <Input
            placeholder="Ruolo"
            {...register(`experiences.${index}.role`)}
          />
          <Input
            placeholder="Periodo (es. 2018 - Presente)"
            {...register(`experiences.${index}.period`)}
          />
          <Textarea
            placeholder="Descrizione (opzionale)"
            rows={2}
            {...register(`experiences.${index}.description`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({ company: "", role: "", period: "", description: "" })
        }
      >
        <Plus className="h-4 w-4" />
        Aggiungi esperienza
      </Button>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="experiences-video">Video correlato (opzionale)</Label>
        <Input
          id="experiences-video"
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
