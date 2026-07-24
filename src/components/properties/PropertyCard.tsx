'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Card } from '@/components/ui';
import { Property, PROPERTY_TYPES_LABELS, PRICE_TYPE_LABELS } from '@/types';
import { formatPrice, getPropertyCode, cn } from '@/lib';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
  compact?: boolean;
}

export function PropertyCard({ property, featured = false, compact = false }: PropertyCardProps) {
  const propertyUrl = `/propiedades/${property.slug}`;
  const typeLabel = PROPERTY_TYPES_LABELS[property.property_type];
  const priceLabel = PRICE_TYPE_LABELS[property.price_type];
  const propertyCode = getPropertyCode(property);

  return (
    <Link href={propertyUrl} className="block group">
      <Card
        hover
        padding="none"
        className={cn(
          'overflow-hidden',
          featured && 'md:flex md:max-h-80'
        )}
      >
        {/* Image */}
        <div
          className={cn(
            'relative overflow-hidden bg-gray-200',
            featured ? 'md:w-1/2 aspect-[4/3] md:aspect-auto' : 'aspect-[4/3]',
            compact && 'aspect-[16/10]'
          )}
        >
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className={cn(
                "object-cover transition-transform duration-300 group-hover:scale-105",
                (property.status === 'sold' || property.status === 'rented') && "opacity-60 grayscale-[35%]"
              )}
              sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 640px) 50vw, 100vw'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-primary-600 text-white rounded shadow-sm">
              {priceLabel}
            </span>
            {featured && (
              <span className="px-2 py-1 text-xs font-medium bg-accent-500 text-white rounded shadow-sm">
                Destacada
              </span>
            )}
            {property.status === 'sold' && (
              <span className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded shadow-sm">
                Vendida
              </span>
            )}
            {property.status === 'rented' && (
              <span className="px-2 py-1 text-xs font-semibold bg-amber-500 text-white rounded shadow-sm">
                Arrendada
              </span>
            )}
          </div>

          {/* Property Code Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50/95 text-emerald-800 border border-emerald-200/80 shadow-md backdrop-blur-sm">
              {propertyCode}
            </span>
          </div>

          {/* Views count */}
          {property.views > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 text-white text-xs rounded">
              <Eye className="w-3 h-3" />
              {property.views}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn('flex flex-col', featured && 'md:w-1/2 md:p-6')}>
          {/* Price */}
          <div className="px-4 pt-4">
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(property.price, property.price_type)}
            </p>
          </div>

          {/* Title & Type */}
          <div className="px-4 pt-2">
            <h3 className={cn(
              'font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2',
              compact ? 'text-base' : 'text-lg'
            )}>
              {property.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{typeLabel}</p>
          </div>

          {/* Location */}
          <div className="px-4 pt-2 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{property.city}, {property.region}</span>
          </div>

          {/* Features */}
          {(property.bedrooms || property.bathrooms || property.area) && (
            <div className="px-4 py-3 mt-auto flex items-center gap-4 border-t border-gray-100 dark:border-gray-700">
              {property.bedrooms && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Square className="w-4 h-4" />
                  <span>{property.area} m²</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}