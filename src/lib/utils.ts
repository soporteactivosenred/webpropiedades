/**
 * Format a price:
 * - Venta → UF (e.g. "3.375 UF")
 * - Arriendo → CLP/mes (e.g. "$450.000/mes")
 */
export function formatPrice(price: number, priceType: 'sale' | 'rent'): string {
  if (priceType === 'rent') {
    const clp = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(price);
    return `${clp}/mes`;
  }

  // Venta → UF
  const uf = new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 2,
  }).format(price);
  return `${uf} UF`;
}


/**
 * Format a price without currency symbol
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-CL').format(num);
}

/**
 * Format area in square meters
 */
export function formatArea(area: number): string {
  return `${formatNumber(area)} m²`;
}

/**
 * Format a date in Spanish
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('es-CL', options || defaultOptions).format(
    new Date(date)
  );
}

/**
 * Format a relative time (e.g., "hace 2 días")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'ahora mismo';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Chilean format)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  // Accepts +56 9 XXXX XXXX, 569XXXXXXXX, 9XXXXXXXX formats
  const phoneRegex = /^(\+56)?9\d{8}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Format phone for WhatsApp link
 */
export function formatWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const base = `https://wa.me/${cleaned}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Class name utility (like clsx/classnames)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Obtiene o genera el Código de Referencia de una propiedad (ej. COD-1041)
 */
export function getPropertyCode(property: { code?: string | null; slug?: string; id?: string } | null | undefined): string {
  if (!property) return 'COD-0000';
  
  if (property.code && typeof property.code === 'string' && property.code.trim() !== '') {
    const clean = property.code.trim().toUpperCase();
    return clean.startsWith('COD-') || clean.startsWith('REF-') ? clean : `COD-${clean}`;
  }
  
  if (property.slug) {
    const match = property.slug.match(/-(\d+)$/);
    if (match && match[1]) {
      return `COD-${match[1]}`;
    }
  }

  if (property.id) {
    const cleanId = property.id.replace(/-/g, '').slice(0, 6).toUpperCase();
    return `COD-${cleanId}`;
  }

  return 'COD-0000';
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}