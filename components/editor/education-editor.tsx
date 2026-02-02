"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
}

interface EducationData {
  items: EducationItem[];
}

interface EducationFormValues {
  items: Array<{ institution: string; degree: string; year: string }>;
}

interface EducationEditorProps {
  data: EducationData;
  onChange: (data: EducationData) => void;
}

function toFormValues(data: EducationData): EducationFormValues {
  return {
    items: (data.items ?? []).map((item) => ({
      institution: item.institution,
      degree: item.degree,
      year: item.year ?? "",
    })),
  };
}

function toEducationData(values: EducationFormValues): EducationData {
  return {
    items: values.items
      .filter(
        (item) =>
          item.institution.trim() !== "" || item.degree.trim() !== ""
      )
      .map((item) => ({
        institution: item.institution,
        degree: item.degree,
        year: item.year || undefined,
      })),
  };
}

export function EducationEditor({ data, onChange }: EducationEditorProps) {
  const { register, control, watch } = useForm<EducationFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toEducationData(values as EducationFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <Label>Percorso formativo</Label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Titolo {index + 1}
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
            placeholder="Istituto / Universita"
            {...register(`items.${index}.institution`)}
          />
          <Input
            placeholder="Titolo di studio"
            {...register(`items.${index}.degree`)}
          />
          <Input
            placeholder="Anno (es. 2015)"
            {...register(`items.${index}.year`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ institution: "", degree: "", year: "" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi titolo di studio
      </Button>
    </div>
  );
}
