"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BannerData {
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  videoUrl?: string;
}

interface BannerEditorProps {
  data: BannerData;
  onChange: (data: BannerData) => void;
}

export function BannerEditor({ data, onChange }: BannerEditorProps) {
  const { register, watch } = useForm<BannerData>({
    defaultValues: {
      imageUrl: data.imageUrl ?? "",
      linkUrl: data.linkUrl ?? "",
      altText: data.altText ?? "",
      videoUrl: data.videoUrl ?? "",
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange({
        imageUrl: values.imageUrl || undefined,
        linkUrl: values.linkUrl || undefined,
        altText: values.altText || undefined,
        videoUrl: values.videoUrl || undefined,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="banner-image">URL immagine banner</Label>
        <Input
          id="banner-image"
          type="url"
          placeholder="https://esempio.com/banner.jpg"
          {...register("imageUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Formato consigliato: 1200x400px (rapporto 3:1).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="banner-link">URL di destinazione (opzionale)</Label>
        <Input
          id="banner-link"
          type="url"
          placeholder="https://esempio.com/promo"
          {...register("linkUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Se compilato, il banner diventa cliccabile.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="banner-alt">Testo alternativo</Label>
        <Input
          id="banner-alt"
          placeholder="Descrizione del banner per accessibilita"
          {...register("altText")}
        />
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="banner-video">Video correlato (opzionale)</Label>
        <Input
          id="banner-video"
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
