'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface PropertySchemaProps {
  name: string;
  description: string;
  price: number;
  priceType: 'sale' | 'rent';
  address: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image?: string;
  url?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Organization Schema Component
 * Renders JSON-LD schema for the real estate company
 */
export function OrganizationSchema({
  name = 'Activos en Red',
  description = 'Encuentra tu próxima propiedad con Activos en Red. Casas, departamentos, terrenos y más.',
  url = 'https://activosenred.cl',
  logo = '/images/logo.png',
  email = 'contacto@activosenred.cl',
  phone = '+56 9 73081220',
  address = 'Gómez Carreño 333, La Serena',
  socialLinks = {},
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name,
    description,
    url,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl'}${logo}`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl'}/images/og-default.jpg`,
    email,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Santiago',
      addressCountry: 'CL',
    },
    sameAs: Object.values(socialLinks).filter(Boolean),
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Real Estate Listing Schema Component
 * Renders JSON-LD schema for a property listing
 */
export function RealEstateListingSchema({
  name,
  description,
  price,
  priceType,
  address,
  city,
  bedrooms,
  bathrooms,
  area,
  image,
  url,
}: PropertySchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl';
  const offerType = priceType === 'sale' ? 'ForSaleOffer' : 'RentOffer';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name,
    description,
    url: url || siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      addressCountry: 'CL',
    },
    offers: {
      '@type': offerType,
      price: price,
      priceCurrency: 'CLP',
      availability: 'https://schema.org/InStock',
    },
    ...(bedrooms && { numberOfRooms: bedrooms }),
    ...(bathrooms && { numberOfBathroomsTotal: bathrooms }),
    ...(area && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: area,
        unitCode: 'MTK',
      },
    }),
    ...(image && { image }),
  };

  return (
    <Script
      id="property-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb List Schema Component
 * Renders JSON-LD schema for breadcrumb navigation
 */
export function BreadcrumbListSchema({ items }: BreadcrumbSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Combined SEO Schema Provider
 * Renders all necessary schema structures for a page
 */
export interface SEOSchemaProps {
  organization?: Omit<OrganizationSchemaProps, never>;
  property?: PropertySchemaProps;
  breadcrumbs?: BreadcrumbItem[];
  pageType?: 'home' | 'properties' | 'property-detail' | 'blog' | 'blog-post' | 'static';
}

export function SchemaOrg({ organization, property, breadcrumbs, pageType = 'static' }: SEOSchemaProps) {
  return (
    <>
      {/* Always include Organization schema */}
      <OrganizationSchema {...(organization || {})} />

      {/* Property-specific schema */}
      {property && <RealEstateListingSchema {...property} />}

      {/* Breadcrumb schema */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbListSchema items={breadcrumbs} />
      )}
    </>
  );
}

export default SchemaOrg;