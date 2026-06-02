/**
 * Formatting utilities for Chilean real estate platform
 */

/**
 * Format a number as Chilean Pesos (CLP)
 * Uses periods as thousands separator and no decimals
 */
export function formatPriceCLP(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price with optional "UF" suffix for comparison display
 * UF value is hardcoded as it changes daily (use API for real UF value)
 */
export function formatPriceInUF(priceCLP: number, ufValue: number = 38000): string {
  const ufAmount = priceCLP / ufValue;
  return `${formatPriceCLP(priceCLP)} (~${ufAmount.toFixed(1)} UF)`;
}

/**
 * Format area in square meters
 */
export function formatArea(area: number, unit: string = 'm²'): string {
  return `${area.toLocaleString('es-CL')} ${unit}`;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('es-CL');
}

/**
 * Format a phone number to Chilean format
 */
export function formatPhoneCLP(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Chilean phone formats
  if (digits.length === 9) {
    // Mobile: +56 9 XXXX XXXX
    return `+56 9 ${digits.slice(1, 5)} ${digits.slice(5)}`;
  } else if (digits.length === 8) {
    // Landline: +56 2 XXXX XXXX (Santiago) or +56 XX XXX XXXX (regions)
    const isSantiago = digits.startsWith('2');
    if (isSantiago) {
      return `+56 2 ${digits.slice(1, 5)} ${digits.slice(5)}`;
    } else {
      return `+56 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    }
  }
  
  // Return original if format doesn't match
  return phone;
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeDate(dateObj);
  }

  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'short', year: 'numeric' };

  return dateObj.toLocaleDateString('es-CL', options);
}

/**
 * Format date as relative time (e.g., "hace 3 días")
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Ayer';
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format property feature for display
 */
export function formatFeature(feature: string): string {
  // Capitalize first letter and replace underscores with spaces
  return feature
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Format bedroom/bathroom count for display
 */
export function formatRoomCount(count: number | null, label: 'dormitorio' | 'dormitorios' | 'baño' | 'baños' = 'dormitorio'): string {
  if (count === null || count === 0) return 'Sin especificar';
  
  const pluralLabel = count === 1 ? label.replace('s', '') : label;
  return `${count} ${pluralLabel}`;
}

/**
 * Format property address for display
 */
export function formatAddress(
  address: string,
  city: string,
  region?: string
): string {
  const parts = [address];
  if (city) parts.push(city);
  if (region) parts.push(region);
  return parts.join(', ');
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format property status for display
 */
export function formatPropertyStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'Borrador',
    active: 'En publicación',
    sold: 'Vendida',
    rented: 'Arrendada',
  };
  return statusMap[status] || status;
}

/**
 * Format lead status for display
 */
export function formatLeadStatus(status: string): string {
  const statusMap: Record<string, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    qualified: 'Calificado',
    converted: 'Convertido',
    lost: 'Perdido',
  };
  return statusMap[status] || status;
}

/**
 * Format a URL for display (without protocol)
 */
export function formatUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * Generate excerpt from HTML content
 */
export function generateExcerpt(html: string, maxLength: number = 160): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return truncateText(text, maxLength);
}