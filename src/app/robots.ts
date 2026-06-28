import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://blog.proklinik.app';

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/_next/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}