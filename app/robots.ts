import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/uploads/", "/api/vcard/"],
        disallow: [
          "/api/",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/invite",
          "/consultants/",
          "/domains/",
          "/submissions/",
          "/media/",
          "/settings/",
          "/editor/",
          "/my-profile/",
          "/my-landing/",
        ],
      },
    ],
  };
}
