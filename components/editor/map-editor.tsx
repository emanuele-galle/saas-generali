"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MapData {
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

interface MapEditorProps {
  data: MapData;
  onChange: (data: MapData) => void;
}

export function MapEditor({ data, onChange }: MapEditorProps) {
  const { register, watch } = useForm<MapData>({
    defaultValues: {
      address: data.address ?? "",
      latitude: data.latitude ?? 0,
      longitude: data.longitude ?? 0,
      zoom: data.zoom ?? 15,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onChange({
        address: values.address || undefined,
        latitude: values.latitude ? Number(values.latitude) : undefined,
        longitude: values.longitude ? Number(values.longitude) : undefined,
        zoom: values.zoom ? Number(values.zoom) : 15,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="map-address">Indirizzo completo</Label>
        <Input
          id="map-address"
          placeholder="Es. Via Roma 1, 20100 Milano MI"
          {...register("address")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="map-lat">Latitudine</Label>
          <Input
            id="map-lat"
            type="number"
            step="any"
            placeholder="Es. 45.4642"
            {...register("latitude", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="map-lng">Longitudine</Label>
          <Input
            id="map-lng"
            type="number"
            step="any"
            placeholder="Es. 9.1900"
            {...register("longitude", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="map-zoom">Livello di zoom</Label>
        <Input
          id="map-zoom"
          type="number"
          min={1}
          max={20}
          placeholder="15"
          {...register("zoom", { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground">
          Valore da 1 (mondo intero) a 20 (dettaglio massimo). Consigliato: 15.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Puoi trovare le coordinate su{" "}
        <a
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Google Maps
        </a>{" "}
        cliccando con il tasto destro sulla posizione desiderata.
      </p>
    </div>
  );
}
