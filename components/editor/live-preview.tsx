"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  slug: string;
  refreshKey: number;
}

type ViewMode = "desktop" | "mobile";

const VIEWPORT_WIDTHS: Record<ViewMode, number> = {
  desktop: 1440,
  mobile: 375,
};

export function LivePreview({ slug, refreshKey }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [scale, setScale] = useState(1);

  const previewUrl = `/${slug}?preview=true&t=${refreshKey}&_=${Date.now()}`;

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const viewportWidth = VIEWPORT_WIDTHS[viewMode];
    setScale(Math.min(containerWidth / viewportWidth, 1));
  }, [viewMode]);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [updateScale]);

  function handleRefresh(): void {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = previewUrl;
    }
  }

  function handleIframeLoad(): void {
    setIsLoading(false);
  }

  const viewportWidth = VIEWPORT_WIDTHS[viewMode];

  return (
    <div className="flex h-full flex-col">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Anteprima</span>
          {isLoading && (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={viewMode === "desktop" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={viewMode === "mobile" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>

          <div className="mx-1 h-4 w-px bg-border" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Iframe Container */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-muted/20"
      >
        <div
          className={cn(
            "mx-auto h-full origin-top-left",
            viewMode === "mobile" && "origin-top",
          )}
          style={{
            width: viewportWidth,
            height: scale > 0 ? `${100 / scale}%` : "100%",
            transform: `scale(${scale})`,
            transformOrigin: viewMode === "mobile" ? "top center" : "top left",
          }}
        >
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="Anteprima landing page"
            className="h-full w-full border-0 bg-white"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>
  );
}
