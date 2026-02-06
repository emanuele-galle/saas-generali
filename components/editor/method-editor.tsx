"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Phase {
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
}

interface Tool {
  name: string;
  description: string;
}

interface MethodData {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  phases: Phase[];
  tools?: Tool[];
}

interface MethodFormValues {
  title: string;
  subtitle: string;
  videoUrl: string;
  phases: Array<{ title: string; subtitle: string; description: string; bullets: string }>;
  tools: Array<{ name: string; description: string }>;
}

interface MethodEditorProps {
  data: MethodData;
  onChange: (data: MethodData) => void;
}

function toFormValues(data: MethodData): MethodFormValues {
  return {
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    videoUrl: data.videoUrl ?? "",
    phases: (data.phases ?? []).map((p) => ({
      title: p.title,
      subtitle: p.subtitle ?? "",
      description: p.description,
      bullets: (p.bullets ?? []).join("\n"),
    })),
    tools: (data.tools ?? []).map((t) => ({
      name: t.name,
      description: t.description,
    })),
  };
}

function toMethodData(values: MethodFormValues): MethodData {
  return {
    title: values.title || undefined,
    subtitle: values.subtitle || undefined,
    videoUrl: values.videoUrl || undefined,
    phases: values.phases
      .filter((p) => p.title.trim() !== "")
      .map((p) => ({
        title: p.title,
        subtitle: p.subtitle || undefined,
        description: p.description,
        bullets: p.bullets
          ? p.bullets.split("\n").filter((b) => b.trim() !== "")
          : undefined,
      })),
    tools: values.tools
      .filter((t) => t.name.trim() !== "")
      .map((t) => ({
        name: t.name,
        description: t.description,
      })),
  };
}

export function MethodEditor({ data, onChange }: MethodEditorProps) {
  const { register, control, watch } = useForm<MethodFormValues>({
    defaultValues: toFormValues(data),
  });

  const phases = useFieldArray({ control, name: "phases" });
  const tools = useFieldArray({ control, name: "tools" });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toMethodData(values as MethodFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="method-title">Titolo sezione</Label>
        <Input
          id="method-title"
          placeholder="Es. Il Mio Metodo"
          {...register("title")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="method-subtitle">Sottotitolo (opzionale)</Label>
        <Input
          id="method-subtitle"
          placeholder="Es. Un percorso in tre fasi"
          {...register("subtitle")}
        />
      </div>

      <Label>Fasi del metodo</Label>
      {phases.fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Fase {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => phases.remove(index)}
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Input
            placeholder="Titolo fase"
            {...register(`phases.${index}.title`)}
          />
          <Input
            placeholder="Sottotitolo (opzionale)"
            {...register(`phases.${index}.subtitle`)}
          />
          <Textarea
            placeholder="Descrizione"
            rows={3}
            {...register(`phases.${index}.description`)}
          />
          <Textarea
            placeholder="Punti chiave (uno per riga)"
            rows={3}
            {...register(`phases.${index}.bullets`)}
          />
          <p className="text-xs text-muted-foreground">
            Scrivi un punto per riga. Verranno mostrati come elenco puntato.
          </p>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => phases.append({ title: "", subtitle: "", description: "", bullets: "" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi fase
      </Button>

      <div className="border-t pt-4">
        <Label>Strumenti (opzionale)</Label>
        {tools.fields.map((field, index) => (
          <div
            key={field.id}
            className="mt-2 space-y-2 rounded-lg border bg-muted/30 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Strumento {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => tools.remove(index)}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Input
              placeholder="Nome strumento"
              {...register(`tools.${index}.name`)}
            />
            <Textarea
              placeholder="Descrizione"
              rows={2}
              {...register(`tools.${index}.description`)}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => tools.append({ name: "", description: "" })}
        >
          <Plus className="h-4 w-4" />
          Aggiungi strumento
        </Button>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="method-video">Video correlato (opzionale)</Label>
        <Input
          id="method-video"
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
