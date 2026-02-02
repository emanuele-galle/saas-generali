"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Skill {
  name: string;
  description?: string;
}

interface SkillsData {
  skills: Skill[];
}

interface SkillsFormValues {
  skills: Array<{ name: string; description: string }>;
}

interface SkillsEditorProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}

function toFormValues(data: SkillsData): SkillsFormValues {
  return {
    skills: (data.skills ?? []).map((s) => ({
      name: s.name,
      description: s.description ?? "",
    })),
  };
}

function toSkillsData(values: SkillsFormValues): SkillsData {
  return {
    skills: values.skills
      .filter((s) => s.name.trim() !== "")
      .map((s) => ({
        name: s.name,
        description: s.description || undefined,
      })),
  };
}

export function SkillsEditor({ data, onChange }: SkillsEditorProps) {
  const { register, control, watch } = useForm<SkillsFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toSkillsData(values as SkillsFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <Label>Competenze professionali</Label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Competenza {index + 1}
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
            placeholder="Nome competenza"
            {...register(`skills.${index}.name`)}
          />
          <Input
            placeholder="Descrizione (opzionale)"
            {...register(`skills.${index}.description`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: "", description: "" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi competenza
      </Button>
    </div>
  );
}
