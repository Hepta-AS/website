import { MetadataRoute } from 'next';

// Define a placeholder list of services.
// In a real-world scenario, you would fetch this from a CMS or database.
const services = [
  { slug: 'webutvikling', lastModified: new Date() },
  { slug: 'digital-markedsforing', lastModified: new Date() },
  { slug: 'seo-optimalisering', lastModified: new Date() },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hepta.biz';

  // Generate URLs for each service
  const serviceUrls = services.map((service) => ({
    url: `${baseUrl}/tjenester/${service.slug}`,
    lastModified: service.lastModified,
  }));

  // Combine with static URLs
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/om-oss`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tjenester`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
    },
  ];
  
  return [...staticUrls, ...serviceUrls];
} 