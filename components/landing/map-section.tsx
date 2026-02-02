import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapData {
  latitude: number;
  longitude: number;
  zoom?: number;
  address?: string;
}

interface MapSectionProps {
  mapData: MapData;
}

export function MapSection({ mapData }: MapSectionProps) {
  const zoom = mapData.zoom ?? 15;
  const embedUrl = `https://maps.google.com/maps?q=${mapData.latitude},${mapData.longitude}&z=${zoom}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapData.latitude},${mapData.longitude}`;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border shadow-sm">
          {/* Map Embed */}
          <div className="relative h-[400px] w-full">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Posizione consulente"
            />
          </div>

          {/* Address Bar */}
          {mapData.address && (
            <div className="flex flex-col items-start justify-between gap-4 bg-white p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground">{mapData.address}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4" />
                  Indicazioni stradali
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
