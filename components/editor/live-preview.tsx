"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  slug: string;
  refreshKey: number;
}

type ViewMode = "desktop" | "mobile";

export function LivePreview({ slug, refreshKey }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");

  const previewUrl = `/${slug}?preview=true&t=${refreshKey}`;

  function handleRefresh(): void {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = previewUrl;
    }
  }

  function handleIframeLoad(): void {
    setIsLoading(false);
  }

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
      <div className="relative flex-1 overflow-hidden bg-muted/20">
        <div
          className={cn(
            "mx-auto h-full",
            viewMode === "desktop" && "w-full",
            viewMode === "mobile" && "w-[375px]",
          )}
        >
          <div
            className="h-full w-full origin-top"
            style={{
              transform: "scale(0.5)",
              width: "200%",
              height: "200%",
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
    </div>
  );
}
