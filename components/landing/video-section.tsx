interface VideoData {
  videoUrl?: string;
  title?: string;
  description?: string;
}

interface VideoSectionProps {
  videoData: VideoData;
}

function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

export function VideoSection({ videoData }: VideoSectionProps) {
  if (!videoData.videoUrl) return null;

  const embedUrl = getEmbedUrl(videoData.videoUrl);
  if (!embedUrl) return null;

  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {videoData.title && (
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Video
          </p>
        )}
        {videoData.title && (
          <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
            {videoData.title}
          </h2>
        )}
        {videoData.description && (
          <p className="mx-auto mb-10 max-w-2xl text-center text-white/60">
            {videoData.description}
          </p>
        )}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src={embedUrl}
            title={videoData.title ?? "Video presentazione"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
