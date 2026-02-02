import Image from "next/image";

interface BannerData {
  imageUrl?: string;
  altText?: string;
  linkUrl?: string;
}

interface BannerSectionProps {
  bannerData: BannerData;
}

export function BannerSection({ bannerData }: BannerSectionProps) {
  const { imageUrl, altText, linkUrl } = bannerData;

  if (!imageUrl) {
    return null;
  }

  const alt = altText ?? "Banner promozionale";

  const imageElement = (
    <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl shadow-sm">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );

  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-opacity hover:opacity-90"
          >
            {imageElement}
          </a>
        ) : (
          imageElement
        )}
      </div>
    </section>
  );
}
