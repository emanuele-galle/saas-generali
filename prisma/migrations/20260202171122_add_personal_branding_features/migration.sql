-- AlterTable
ALTER TABLE "consultants" ADD COLUMN     "instagram_url" TEXT,
ADD COLUMN     "tiktok_url" TEXT,
ADD COLUMN     "website_url" TEXT,
ADD COLUMN     "youtube_url" TEXT;

-- AlterTable
ALTER TABLE "landing_pages" ADD COLUMN     "portfolio_data" JSONB,
ADD COLUMN     "quote_data" JSONB;
