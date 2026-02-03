"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VideoData {
  videoUrl?: string;
  title?: string;
  description?: string;
}

interface VideoEditorProps {
  data: VideoData;
  onChange: (data: VideoData) => void;
}

export function VideoEditor({ data, onChange }: VideoEditorProps) {
  const { register, watch } = useForm<VideoData>({
    defaultValues: data,
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange(values as VideoData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="video-url">URL Video (YouTube o Vimeo)</Label>
        <Input
          id="video-url"
          placeholder="https://www.youtube.com/watch?v=..."
          {...register("videoUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Inserisci un link YouTube o Vimeo. Il video viene rilevato automaticamente.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-title">Titolo</Label>
        <Input
          id="video-title"
          placeholder="Video di presentazione"
          {...register("title")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-description">Descrizione</Label>
        <Textarea
          id="video-description"
          placeholder="Una breve descrizione del video..."
          rows={2}
          {...register("description")}
        />
      </div>
    </div>
  );
}
