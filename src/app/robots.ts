import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/onboarding", "/verify-request"],
      },
      // 네이버 검색로봇 명시
      { userAgent: "Yeti", allow: "/" },
      { userAgent: "NaverBot", allow: "/" },
    ],
    sitemap: "https://ppppcn.com/sitemap.xml",
    host: "https://ppppcn.com",
  };
}
