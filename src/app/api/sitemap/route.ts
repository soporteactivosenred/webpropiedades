import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { getAllPropertiesSlugs, getAllBlogSlugs } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://propiedadesmerino.cl';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/vender-mi-propiedad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic property pages
  let propertyUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: propertySlugs } = await getAllPropertiesSlugs(supabase);
    if (propertySlugs && propertySlugs.length > 0) {
      propertyUrls = propertySlugs.map((item) => ({
        url: `${SITE_URL}/propiedades/${item.slug}`,
        lastModified: new Date(item.updated_at || Date.now()),
        changeFrequency: 'weekly',
        priority: item.is_featured ? 0.8 : 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching property slugs for sitemap:', error);
  }

  // Dynamic blog pages
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const { data: blogSlugs } = await getAllBlogSlugs(supabase);
    if (blogSlugs && blogSlugs.length > 0) {
      blogUrls = blogSlugs.map((item) => ({
        url: `${SITE_URL}/blog/${item.slug}`,
        lastModified: new Date(item.updated_at || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching blog slugs for sitemap:', error);
  }

  return [...staticPages, ...propertyUrls, ...blogUrls];
}