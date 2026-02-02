"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface FocusArticle {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  linkUrl: string;
}

interface FocusOnData {
  articles: FocusArticle[];
}

interface FocusOnFormValues {
  articles: Array<{
    title: string;
    excerpt: string;
    imageUrl: string;
    linkUrl: string;
  }>;
}

interface FocusOnEditorProps {
  data: FocusOnData;
  onChange: (data: FocusOnData) => void;
}

function toFormValues(data: FocusOnData): FocusOnFormValues {
  return {
    articles: (data.articles ?? []).map((a) => ({
      title: a.title,
      excerpt: a.excerpt ?? "",
      imageUrl: a.imageUrl ?? "",
      linkUrl: a.linkUrl,
    })),
  };
}

function toFocusOnData(values: FocusOnFormValues): FocusOnData {
  return {
    articles: values.articles
      .filter((a) => a.title.trim() !== "" || a.linkUrl.trim() !== "")
      .map((a) => ({
        title: a.title,
        excerpt: a.excerpt || undefined,
        imageUrl: a.imageUrl || undefined,
        linkUrl: a.linkUrl,
      })),
  };
}

export function FocusOnEditor({ data, onChange }: FocusOnEditorProps) {
  const { register, control, watch } = useForm<FocusOnFormValues>({
    defaultValues: toFormValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "articles",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(toFocusOnData(values as FocusOnFormValues));
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <Label>Articoli in evidenza</Label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Articolo {index + 1}
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
            placeholder="Titolo articolo"
            {...register(`articles.${index}.title`)}
          />
          <Textarea
            placeholder="Estratto / descrizione breve"
            rows={2}
            {...register(`articles.${index}.excerpt`)}
          />
          <Input
            type="url"
            placeholder="URL immagine (opzionale)"
            {...register(`articles.${index}.imageUrl`)}
          />
          <Input
            type="url"
            placeholder="URL articolo"
            {...register(`articles.${index}.linkUrl`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({ title: "", excerpt: "", imageUrl: "", linkUrl: "" })
        }
      >
        <Plus className="h-4 w-4" />
        Aggiungi articolo
      </Button>
    </div>
  );
}
