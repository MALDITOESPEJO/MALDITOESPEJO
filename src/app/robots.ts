import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design", "/search", "/api/"],
      },
    ],
    sitemap: "https://malditoespejo.example/sitemap.xml",
  };
}
