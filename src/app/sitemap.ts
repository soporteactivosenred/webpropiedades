import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase: any = await createServerClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vender-mi-propiedad`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch published properties
  const { data: properties } = await supabase
    .from('properties')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })
    .limit(1000);

  const propertyUrls: MetadataRoute.Sitemap = (properties || []).map((property: { slug: string; updated_at: string }) => ({
    url: `${baseUrl}/propiedades/${property.slug}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch published blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false })
    .limit(500);

  const blogUrls: MetadataRoute.Sitemap = (blogPosts || []).map((post: { slug: string; updated_at: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...propertyUrls, ...blogUrls];
}