import type { Database } from './database';

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export interface BlogPostWithAuthor extends BlogPost {
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  published?: boolean;
}

export const BLOG_CATEGORIES = [
  'Noticias del mercado',
  'Consejos de compra',
  'Consejos de venta',
  'Guía de arriendo',
  'Tendencias inmobiliarias',
  'Finanzas y créditos',
  'Mantenimiento',
  'Decoración',
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];