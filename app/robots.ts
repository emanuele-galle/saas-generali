import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/consultants/", "/domains/", "/submissions/", "/media/", "/settings/", "/editor/", "/my-profile/", "/my-landing/"],
      },
    ],
  };
}
