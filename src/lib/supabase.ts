import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side client with service role for admin operations
export function createServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables.');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Type-safe helper for fetching data
export async function fetchProperties(filters?: {
  price_type?: string;
  property_type?: string;
  city?: string;
  limit?: number;
}) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'active');

  if (filters?.price_type) {
    query = query.eq('price_type', filters.price_type);
  }
  if (filters?.property_type) {
    query = query.eq('property_type', filters.property_type);
  }
  if (filters?.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  return query.order('created_at', { ascending: false });
}

export async function fetchPropertyBySlug(slug: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  return supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();
}

export async function fetchBlogPosts(options?: {
  published?: boolean;
  limit?: number;
  category?: string;
}) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  let query = supabase.from('blog_posts').select('*');

  if (options?.published !== undefined) {
    query = query.eq('published', options.published);
  }
  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return query.order('published_at', { ascending: false });
}