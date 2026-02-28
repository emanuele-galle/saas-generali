-- AlterTable
ALTER TABLE "custom_domains" ADD COLUMN     "cloudflare_nameservers" TEXT,
ADD COLUMN     "cloudflare_zone_id" TEXT;
