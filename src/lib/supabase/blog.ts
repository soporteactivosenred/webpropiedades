/**
 * Blog post-related database helpers for Supabase.
 * These functions provide type-safe CRUD operations for blog posts.
 */

import type { Database, BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types';
import { slugify } from '@/lib';
import { getErrorMessage, isSupabaseError } from './types';

type SupabaseClient<T> = any;

/**
 * Get all published blog posts with optional filters.
 */
export async function getBlogPosts(
  client: SupabaseClient<Database>,
  options?: {
    limit?: number;
    category?: string;
    tags?: string[];
  }
): Promise<{ data: BlogPost[]; error: string | null }> {
  let query = client
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .not('published_at', 'is', null);

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.tags && options.tags.length > 0) {
    query = query.contains('tags', options.tags);
  }

  query = query.order('published_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const result = await query;

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data || [], error: null };
}

/**
 * Get recent blog posts.
 */
export async function getRecentBlogPosts(
  client: SupabaseClient<Database>,
  limit = 5
): Promise<{ data: BlogPost[]; error: string | null }> {
  return getBlogPosts(client, { limit });
}

/**
 * Get featured blog post (most recent with featured_image).
 */
export async function getFeaturedBlogPost(
  client: SupabaseClient<Database>
): Promise<{ data: BlogPost | null; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .not('published_at', 'is', null)
    .not('featured_image', 'is', null)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data?.[0] || null, error: null };
}

/**
 * Get a single blog post by ID.
 */
export async function getBlogPostById(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ data: BlogPost | null; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Get a single blog post by slug.
 */
export async function getBlogPostBySlug(
  client: SupabaseClient<Database>,
  slug: string
): Promise<{ data: BlogPost | null; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Search blog posts by title or content.
 */
export async function searchBlogPosts(
  client: SupabaseClient<Database>,
  searchTerm: string,
  limit = 20
): Promise<{ data: BlogPost[]; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data || [], error: null };
}

/**
 * Get all blog posts (including drafts) - for admin use.
 */
export async function getAllBlogPosts(
  client: SupabaseClient<Database>,
  options?: {
    limit?: number;
    offset?: number;
    includeUnpublished?: boolean;
  }
): Promise<{ data: BlogPost[]; error: string | null }> {
  let query = client.from('blog_posts').select('*', { count: 'exact' });

  if (!options?.includeUnpublished) {
    query = query.eq('published', true);
  }

  query = query.order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const result = await query;

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data || [], error: null };
}

/**
 * Create a new blog post.
 * Auto-generates slug from title if not provided.
 */
export async function createBlogPost(
  client: SupabaseClient<Database>,
  data: Omit<BlogPostInsert, 'slug'> & { slug?: string }
): Promise<{ data: BlogPost | null; error: string | null }> {
  const slug = data.slug || slugify(data.title);
  const now = new Date().toISOString();

  const insertData = {
    ...data,
    slug,
    published_at: data.published ? now : null,
  };

  const result = await client
    .from('blog_posts')
    .insert(insertData as BlogPostInsert)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Update a blog post.
 */
export async function updateBlogPost(
  client: SupabaseClient<Database>,
  id: string,
  data: BlogPostUpdate
): Promise<{ data: BlogPost | null; error: string | null }> {
  // If title is being updated, regenerate slug unless explicitly provided
  if (data.title && !data.slug) {
    data.slug = slugify(data.title);
  }

  const result = await client
    .from('blog_posts')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Publish a blog post.
 */
export async function publishBlogPost(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ data: BlogPost | null; error: string | null }> {
  const now = new Date().toISOString();

  const result = await client
    .from('blog_posts')
    .update({ published: true, published_at: now } as BlogPostUpdate)
    .eq('id', id)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Unpublish a blog post.
 */
export async function unpublishBlogPost(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ data: BlogPost | null; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .update({ published: false } as BlogPostUpdate)
    .eq('id', id)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Delete a blog post.
 */
export async function deleteBlogPost(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (isSupabaseError(result)) {
    return { success: false, error: getErrorMessage(result) };
  }

  return { success: true, error: null };
}

/**
 * Get all unique blog categories.
 */
export async function getBlogCategories(
  client: SupabaseClient<Database>
): Promise<{ data: string[]; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('category')
    .eq('published', true)
    .not('category', 'is', null);

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  const categories = Array.from(new Set(result.data?.map((p: any) => p.category).filter(Boolean) as string[]));
  return { data: categories, error: null };
}

/**
 * Get all unique blog tags.
 */
export async function getBlogTags(
  client: SupabaseClient<Database>
): Promise<{ data: string[]; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('tags')
    .eq('published', true);

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  const allTags = result.data?.flatMap((p: any) => p.tags || []) || [];
  const uniqueTags = Array.from(new Set(allTags));
  return { data: uniqueTags, error: null };
}

/**
 * Get blog post count.
 */
export async function getBlogPostCount(
  client: SupabaseClient<Database>
): Promise<{ data: number; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('published', true);

  if (isSupabaseError(result)) {
    return { data: 0, error: getErrorMessage(result) };
  }

  return { data: result.count || 0, error: null };
}

/**
 * Get all blog post slugs for sitemap generation.
 */
export async function getAllBlogSlugs(
  client: SupabaseClient<Database>
): Promise<{ data: { slug: string; updated_at: string }[]; error: string | null }> {
  const result = await client
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data || [], error: null };
}