/**
 * URL-friendly slug generator
 * Converts text to lowercase, removes accents, and replaces spaces with hyphens
 */

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace accents with plain letters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove special characters
    .replace(/[^a-z0-9 -]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug by appending a short hash if needed
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 100;

  while (existingSlugs.includes(slug) && counter < maxAttempts) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Extract slug from a full URL
 */
export function extractSlug(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

/**
 * Validate that a string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Spanish-friendly slug generator that handles special characters
 */
export function spanishSlugify(text: string): string {
  // Common Spanish character replacements
  const replacements: Record<string, string> = {
    'á': 'a',
    'é': 'e',
    'í': 'i',
    'ó': 'o',
    'ú': 'u',
    'ü': 'u',
    'ñ': 'n',
    'Á': 'a',
    'É': 'e',
    'Í': 'i',
    'Ó': 'o',
    'Ú': 'u',
    'Ü': 'u',
    'Ñ': 'n',
  };

  let result = text;
  for (const [char, replacement] of Object.entries(replacements)) {
    result = result.replace(new RegExp(char, 'g'), replacement);
  }

  return slugify(result);
}