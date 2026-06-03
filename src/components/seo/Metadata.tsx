'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  noIndex?: boolean;
}

/**
 * Client-side metadata component for dynamic SEO
 * Updates document head with Open Graph and other meta tags
 */
export function Metadata({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  author,
  noIndex = false,
}: MetadataProps) {
  const pathname = usePathname();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl';
  const siteName = 'Activos en Red';

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Tu hogar, nuestra pasión`;
  const fullUrl = `${siteUrl}${pathname}`;
  const ogImage = image || `${siteUrl}/images/og-default.jpg`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta description
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }

    // Update or create Open Graph tags
    const updateMeta = (property: string, content: string, prefix?: 'og' | 'twitter') => {
      const attr = prefix ? `${prefix}:${property}` : property;
      let meta = document.querySelector(`meta[property="${attr}"]`) ||
                 document.querySelector(`meta[name="${attr}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(prefix ? 'property' : 'name', attr);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Open Graph
    updateMeta('og:title', fullTitle, 'og');
    updateMeta('og:url', fullUrl, 'og');
    updateMeta('og:type', type, 'og');
    if (description) updateMeta('og:description', description, 'og');
    updateMeta('og:image', ogImage, 'og');
    updateMeta('og:site_name', siteName, 'og');

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'twitter');
    updateMeta('twitter:title', fullTitle, 'twitter');
    if (description) updateMeta('twitter:description', description, 'twitter');
    updateMeta('twitter:image', ogImage, 'twitter');

    // Article-specific meta
    if (type === 'article' && publishedTime) {
      updateMeta('article:published_time', publishedTime, 'og');
    }
    if (type === 'article' && author) {
      updateMeta('article:author', author, 'og');
    }
  }, [fullTitle, fullUrl, ogImage, description, type, publishedTime, author]);

  // Handle noindex
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    if (noIndex) {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsMeta.setAttribute('content', 'index, follow');
    }
  }, [noIndex]);

  return null;
}

export default Metadata;