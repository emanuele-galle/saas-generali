"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface FaqData {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  items: { question: string; answer: string }[];
}

interface FaqFormValues {
  title: string;
  subtitle: string;
  videoUrl: string;
  items: Array<{ question: string; answer: string }>;
}

interface FaqEditorProps {
  data: FaqData;
  onChange: (data: FaqData) => void;
}

function toFormValues(data: FaqData): FaqFormValues {
  return {
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    videoUrl: data.videoUrl ?? "",
    items: (data.items ?? []).map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  };
}

function toFaqData(values: FaqFormValues): FaqData {
  return {
    title: values.title || undefined,
    subtitle: values.subtitle || undefined,
    videoUrl: values.videoUrl || undefined,
    items: values.items
      .filter((item) => item.question.trim() !== "")
      .map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
  };
}

export function FaqEditor({ data, onChange }: FaqEditorProps) {
  const { register, control, watch } = useForm<FaqFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toFaqData(values as FaqFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="faq-title">Titolo sezione</Label>
        <Input
          id="faq-title"
          placeholder="Es. Domande Frequenti"
          {...register("title")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="faq-subtitle">Sottotitolo (opzionale)</Label>
        <Input
          id="faq-subtitle"
          placeholder="Es. Le risposte alle domande piu comuni"
          {...register("subtitle")}
        />
      </div>

      <Label>Domande e risposte</Label>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              FAQ {index + 1}
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
            placeholder="Domanda"
            {...register(`items.${index}.question`)}
          />
          <Textarea
            placeholder="Risposta"
            rows={3}
            {...register(`items.${index}.answer`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ question: "", answer: "" })}
      >
        <Plus className="h-4 w-4" />
        Aggiungi FAQ
      </Button>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="faq-video">Video correlato (opzionale)</Label>
        <Input
          id="faq-video"
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
