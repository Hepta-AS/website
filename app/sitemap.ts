import { MetadataRoute } from 'next';
import { services } from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hepta.biz';

  // Generate URLs for each service from the single source of truth
  const serviceUrls = services.map((service) => ({
    url: `${baseUrl}/tjenester/${service.slug}`,
    // You might want to add a lastModified date to your services data in the future
    lastModified: new Date(),
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