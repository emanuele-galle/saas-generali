export function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)(?:\/([a-f0-9]+))?/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    // Extract privacy hash from path (/VIDEO_ID/HASH) or query param (?h=HASH)
    const hashFromPath = vimeoMatch[2];
    const hashFromQuery = new URL(url, "https://vimeo.com").searchParams.get("h");
    const hash = hashFromPath || hashFromQuery;
    const hashParam = hash ? `&h=${hash}` : "";
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&title=0&byline=0&portrait=0${hashParam}`;
  }
  return null;
}
