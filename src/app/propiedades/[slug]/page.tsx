import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Calendar, Eye, Phone, Mail, Check, ArrowLeft, Layers } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/properties/PropertyMap'), { ssr: false });
import { createServerClient } from '@/lib/supabase/server';
import { getPropertyBySlug, incrementPropertyViews } from '@/lib/supabase';
import { formatPrice, formatArea, formatDate, getPropertyCode, cn } from '@/lib';
import { PROPERTY_TYPES_LABELS, PRICE_TYPE_LABELS, STATUS_LABELS, DEFAULT_SETTINGS } from '@/types';
import { PropertyContactForm } from './PropertyContactForm';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { PropertyGallery } from '@/components/properties';

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://propiedadesmerino.cl';
const SITE_NAME = 'Activos en Red';

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase: any = await createServerClient();
  const { data: property } = await getPropertyBySlug(supabase, slug);

  if (!property) {
    return {
      title: 'Propiedad no encontrada',
      description: 'La propiedad que buscas no está disponible.',
    };
  }

  const ogImage = property.images?.[0] || `${SITE_URL}/images/og-default.jpg`;
  const description = property.description.slice(0, 160);

  return {
    title: `${property.title} | ${SITE_NAME}`,
    description,
    keywords: `${property.title}, ${property.property_type}, ${property.city}, propiedades en venta, Activos en Red`,
    openGraph: {
      title: property.title,
      description,
      type: 'website',
      url: `${SITE_URL}/propiedades/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: 'es_CL',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_URL}/propiedades/${slug}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase: any = await createServerClient();
  
  const [propertyResult, incrementResult] = await Promise.all([
    getPropertyBySlug(supabase, slug),
    incrementPropertyViews(supabase, ''), // Will be called separately after we get the ID
  ]);

  const { data: property, error } = propertyResult;

  if (error || !property) {
    notFound();
  }

  // Increment views (fire and forget)
  incrementPropertyViews(supabase, property.id);

  let agentProfile: any = null;
  if (property.agent_id) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone, avatar_url, role')
        .eq('id', property.agent_id)
        .single();
      agentProfile = profile;
    } catch (err) {
      console.error('Error fetching agent profile:', err);
    }
  }

  const typeLabel = PROPERTY_TYPES_LABELS[property.property_type as keyof typeof PROPERTY_TYPES_LABELS];
  const priceLabel = PRICE_TYPE_LABELS[property.price_type as keyof typeof PRICE_TYPE_LABELS];
  const statusLabel = STATUS_LABELS[property.status as keyof typeof STATUS_LABELS];
  const propertyCode = getPropertyCode(property);
  const fullPropertyUrl = `${SITE_URL}/propiedades/${slug}`;

  return (
    <>
      {/* SEO Schemas */}
      <SchemaOrg
        property={{
          name: property.title,
          description: property.description,
          price: property.price,
          priceType: property.price_type,
          address: property.address,
          city: property.city,
          bedrooms: property.bedrooms || undefined,
          bathrooms: property.bathrooms || undefined,
          area: property.area || undefined,
          image: property.images?.[0],
          url: `${SITE_URL}/propiedades/${slug}`,
        }}
        breadcrumbs={[
          { name: 'Inicio', url: '/' },
          { name: 'Propiedades', url: '/propiedades' },
          { name: property.title, url: `/propiedades/${slug}` },
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/propiedades"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a propiedades
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Image Gallery */}
        <PropertyGallery images={property.images || []} title={property.title} />

        {/* Status Banner for Sold/Rented */}
        {(property.status === 'sold' || property.status === 'rented') && (
          <div className={cn(
            "mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm",
            property.status === 'sold' 
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-900 dark:text-red-400"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-400"
          )}>
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white flex-shrink-0",
                property.status === 'sold' ? "bg-red-600" : "bg-amber-500"
              )}>
                !
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Propiedad {property.status === 'sold' ? 'Vendida' : 'Arrendada'}</h3>
                <p className="text-sm opacity-90">Este inmueble ya no está disponible para su adquisición o arriendo.</p>
              </div>
            </div>
            <Link href="/propiedades">
              <Button size="sm" variant={property.status === 'sold' ? 'danger' : 'primary'} className="whitespace-nowrap">
                Ver otras propiedades
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-sm">
                  CÓDIGO: {propertyCode}
                </span>
                <span className="badge-primary">{priceLabel}</span>
                <span className="badge-gray">{typeLabel}</span>
                <span className={`badge ${
                  property.status === 'active' ? 'badge-success' : 'badge-warning'
                }`}>
                  {statusLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {property.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>{property.address}, {property.city}, {property.region}</span>
              </div>
            </div>

            {/* Price */}
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPrice(property.price, property.price_type)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 rounded-full text-sm font-semibold shadow-sm gap-1.5">
                    <span>Código Ref:</span>
                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-200">{propertyCode}</span>
                  </div>
                  {property.views > 0 && (
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{property.views} visitas</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Características
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bed className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</p>
                      <p className="text-sm text-gray-500">Habitaciones</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bath className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</p>
                      <p className="text-sm text-gray-500">Baños</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Square className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.area}</p>
                      <p className="text-sm text-gray-500">m² construidos</p>
                    </div>
                  </div>
                )}
                {(property as any).terrain_area && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Layers className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{(property as any).terrain_area}</p>
                      <p className="text-sm text-gray-500">m² terreno</p>
                    </div>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.year_built}</p>
                      <p className="text-sm text-gray-500">Año</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Descripción
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {property.description}
              </p>
            </Card>

            {/* Amenities */}
            {property.features && property.features.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Amenidades
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature: any) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Ubicación (Mapa) */}
            {property.latitude && property.longitude && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Ubicación de la propiedad
                </h2>
                <div className="w-full rounded-xl overflow-hidden shadow-sm">
                  <PropertyMap 
                    latitude={property.latitude} 
                    longitude={property.longitude} 
                    address={property.address} 
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Contact Form */}
            <Card>
              {property.status === 'sold' || property.status === 'rented' ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-950 dark:text-white">Propiedad no disponible</h4>
                  <p className="text-sm text-gray-500">
                    Esta propiedad fue {property.status === 'sold' ? 'vendida' : 'arrendada'} recientemente y ya no recibe mensajes de contacto.
                  </p>
                  <Link href="/propiedades" className="block w-full">
                    <Button variant="outline" className="w-full">
                      Explorar Catálogo
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ¿Te interesa esta propiedad?
                  </h3>
                  <PropertyContactForm propertyId={property.id} propertyTitle={property.title} propertySlug={slug} propertyCode={propertyCode} />
                </>
              )}
            </Card>

            {/* Quick Contact */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contacto directo
              </h3>
              {agentProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-150 border border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-center">
                      {agentProfile.avatar_url ? (
                        <img
                          src={agentProfile.avatar_url}
                          alt={agentProfile.full_name || 'Agente'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-sm">
                          {agentProfile.full_name?.substring(0, 2).toUpperCase() || 'AG'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-950 dark:text-white leading-snug">
                        {agentProfile.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {agentProfile.role === 'admin' ? 'Administrador' : 'Agente Inmobiliario'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    {agentProfile.phone && (
                      <a href={`tel:${agentProfile.phone}`} className="block w-full">
                        <Button variant="outline" className="w-full" leftIcon={<Phone className="w-4 h-4" />}>
                          Llamar ahora
                        </Button>
                      </a>
                    )}
                    {agentProfile.email && (
                      <a href={`mailto:${agentProfile.email}`} className="block w-full">
                        <Button className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
                          Enviar email
                        </Button>
                      </a>
                    )}
                    {agentProfile.phone && (
                      <a
                        href={`https://wa.me/${agentProfile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Me interesa la propiedad "${property.title}" (Código: ${propertyCode}). Enlace: ${fullPropertyUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button variant="secondary" className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900" leftIcon={
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.858.002-2.636-1.023-5.11-2.884-6.974C16.59 1.906 14.12 1.08 11.488 1.08c-5.43.003-9.853 4.425-9.856 9.867-.001 1.73.473 3.418 1.373 4.893l-.955 3.491 3.597-.944zm12.334-7.23c-.328-.163-1.937-.954-2.235-1.063-.298-.11-.515-.163-.73.163-.217.327-.838 1.063-1.026 1.28-.188.217-.376.245-.704.082-.328-.162-1.385-.51-2.637-1.627-.975-.87-1.633-1.946-1.824-2.272-.19-.327-.02-.504.143-.667.147-.147.328-.382.492-.573.164-.19.219-.327.328-.545.11-.218.055-.409-.027-.573-.082-.164-.73-1.758-1.002-2.414-.265-.636-.53-.55-.73-.56-.188-.008-.403-.01-.617-.01-.215 0-.563.08-.857.408-.294.328-1.125 1.1-1.125 2.682 0 1.583 1.15 3.11 1.31 3.328.16.218 2.264 3.457 5.485 4.847.766.331 1.365.528 1.829.675.77.244 1.472.21 2.025.128.618-.09 1.937-.79 2.211-1.554.275-.764.275-1.418.192-1.554-.083-.137-.298-.218-.626-.382z"/>
                          </svg>
                        }
                        >
                          WhatsApp
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <a href={`tel:${DEFAULT_SETTINGS.contact_phone}`} className="block w-full">
                    <Button variant="outline" className="w-full" leftIcon={<Phone className="w-4 h-4" />}>
                      Llamar ahora
                    </Button>
                  </a>
                  <a href={`mailto:${DEFAULT_SETTINGS.contact_email}`} className="block w-full">
                    <Button className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
                      Enviar email
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Me interesa la propiedad "${property.title}" (Código: ${propertyCode}). Enlace: ${fullPropertyUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button variant="secondary" className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900" leftIcon={
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.858.002-2.636-1.023-5.11-2.884-6.974C16.59 1.906 14.12 1.08 11.488 1.08c-5.43.003-9.853 4.425-9.856 9.867-.001 1.73.473 3.418 1.373 4.893l-.955 3.491 3.597-.944zm12.334-7.23c-.328-.163-1.937-.954-2.235-1.063-.298-.11-.515-.163-.73.163-.217.327-.838 1.063-1.026 1.28-.188.217-.376.245-.704.082-.328-.162-1.385-.51-2.637-1.627-.975-.87-1.633-1.946-1.824-2.272-.19-.327-.02-.504.143-.667.147-.147.328-.382.492-.573.164-.19.219-.327.328-.545.11-.218.055-.409-.027-.573-.082-.164-.73-1.758-1.002-2.414-.265-.636-.53-.55-.73-.56-.188-.008-.403-.01-.617-.01-.215 0-.563.08-.857.408-.294.328-1.125 1.1-1.125 2.682 0 1.583 1.15 3.11 1.31 3.328.16.218 2.264 3.457 5.485 4.847.766.331 1.365.528 1.829.675.77.244 1.472.21 2.025.128.618-.09 1.937-.79 2.211-1.554.275-.764.275-1.418.192-1.554-.083-.137-.298-.218-.626-.382z"/>
                      </svg>
                    }
                    >
                      WhatsApp
                    </Button>
                  </a>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}