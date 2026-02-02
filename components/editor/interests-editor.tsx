"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const ICON_OPTIONS = [
  { value: "leaf", label: "Natura" },
  { value: "briefcase", label: "Business" },
  { value: "sailboat", label: "Vela" },
  { value: "palette", label: "Arte" },
  { value: "book", label: "Lettura" },
  { value: "camera", label: "Fotografia" },
  { value: "globe", label: "Viaggi" },
  { value: "mountain", label: "Montagna" },
  { value: "music", label: "Musica" },
  { value: "heart", label: "Passione" },
  { value: "trophy", label: "Sport" },
  { value: "film", label: "Cinema" },
  { value: "gamepad", label: "Gaming" },
  { value: "plane", label: "Aereo" },
  { value: "bike", label: "Ciclismo" },
  { value: "dumbbell", label: "Fitness" },
  { value: "utensils", label: "Cucina" },
  { value: "wine", label: "Enogastronomia" },
  { value: "dog", label: "Animali" },
  { value: "home", label: "Casa" },
] as const;

interface Interest {
  name: string;
  icon?: string;
}

interface InterestsData {
  interests: Interest[];
}

interface InterestsFormValues {
  interests: Array<{ name: string; icon: string }>;
}

interface InterestsEditorProps {
  data: InterestsData;
  onChange: (data: InterestsData) => void;
}

function toFormValues(data: InterestsData): InterestsFormValues {
  return {
    interests: (data.interests ?? []).map((i) => ({
      name: i.name,
      icon: i.icon ?? "heart",
    })),
  };
}

function toInterestsData(values: InterestsFormValues): InterestsData {
  return {
    interests: values.interests
      .filter((i) => i.name.trim() !== "")
      .map((i) => ({
        name: i.name,
        icon: i.icon || undefined,
      })),
  };
}

export function InterestsEditor({ data, onChange }: InterestsEditorProps) {
  const { register, control, watch, setValue } = useForm<InterestsFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "interests",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toInterestsData(values as InterestsFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <Label>Interessi personali</Label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex flex-1 gap-2">
            <div className="flex-1">
              <Input
                placeholder="Nome interesse"
                {...register(`interests.${index}.name`)}
              />
            </div>
            <div className="w-40">
              <Select
                value={watch(`interests.${index}.icon`)}
                onValueChange={(value) =>
                  setValue(`interests.${index}.icon`, value, {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Icona" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: "", icon: "heart" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi interesse
      </Button>
    </div>
  );
}
