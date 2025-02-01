import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/privacy-policy',
    },
    sitemap: `${process.env.NEXTAUTH_URL}/sitemap.xml`,
  }
}