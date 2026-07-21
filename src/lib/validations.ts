import { z } from 'zod';

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Lead form validation schema
 */
export const leadFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  phone: z.string().optional(),
  message: z.string().optional(),
  property_id: z.string().uuid().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

/**
 * Property form validation schema
 */
export const propertyFormSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100),
  slug: z.string().min(5, 'El slug debe tener al menos 5 caracteres').max(100),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  price: z.number().min(1, 'El precio debe ser mayor a 0'),
  price_type: z.enum(['sale', 'rent']),
  property_type: z.enum(['house', 'apartment', 'land', 'commercial', 'office', 'industrial']),
  status: z.enum(['draft', 'active', 'sold', 'rented']).default('draft'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  region: z.string().min(2, 'La región debe tener al menos 2 caracteres'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().min(1).optional(),
  parking_spaces: z.number().int().min(0).optional(),
  features: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  year_built: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  publish_to_fb: z.boolean().optional(),
  publish_to_ig: z.boolean().optional(),
  social_caption: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

/**
 * Blog post form validation schema
 */
export const blogPostFormSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(200),
  slug: z.string().min(5, 'El slug debe tener al menos 5 caracteres').max(200),
  excerpt: z.string().max(300, 'El resumen no puede exceder 300 caracteres').optional(),
  content: z.string().min(100, 'El contenido debe tener al menos 100 caracteres'),
  featured_image: z.string().url().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

/**
 * Profile form validation schema
 */
export const profileFormSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Search form validation schema
 */
export const searchSchema = z.object({
  query: z.string().optional(),
  price_type: z.enum(['sale', 'rent']).optional(),
  property_type: z.enum(['house', 'apartment', 'land', 'commercial', 'office', 'industrial']).optional(),
  city: z.string().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  min_bedrooms: z.number().int().min(0).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

/**
 * Validate a form and return formatted errors
 */
export function validateForm<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  for (const error of result.error.errors) {
    const path = error.path.join('.');
    if (!errors[path]) {
      errors[path] = error.message;
    }
  }

  return { success: false, errors };
}