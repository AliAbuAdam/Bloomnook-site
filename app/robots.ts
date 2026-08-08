import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** robots.txt: служебные разделы закрыты, легаси-адреса с query не индексируем. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/account/",
          "/cart/",
          "/auth/",
          "/payment/",
          "/*?id=",
          "/*?cat=",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
