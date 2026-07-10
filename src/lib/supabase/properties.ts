/**
 * Property-related database helpers for Supabase.
 * These functions provide type-safe CRUD operations for properties.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Property, PropertyFilters, PropertyInsert, PropertyUpdate } from '@/types';
import { slugify } from '@/lib';
import { getErrorMessage, isSupabaseError } from './types';

type PropertyRow = Property;
type PropertyClient = any;

/**
 * Get all active properties with optional filters.
 * 
 * @example
 * const { data, error } = await getProperties(supabase, { price_type: 'sale', city: 'Santiago' })
 */
export async function getProperties(
  client: PropertyClient,
  filters?: PropertyFilters & { limit?: number; offset?: number }
) {
  let query = client
    .from('properties')
    .select('*', { count: 'exact' })
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
  if (filters?.filter === 'inversion') {
    query = query.or('description.ilike.%liquidación%,description.ilike.%liquidacion%,description.ilike.%inversión%,description.ilike.%inversion%,description.ilike.%adjudicado%,description.ilike.%remate%,title.ilike.%liquidación%,title.ilike.%liquidacion%,title.ilike.%inversión%,title.ilike.%inversion%,title.ilike.%adjudicado%,title.ilike.%remate%');
  }
  if (filters?.is_bank_liquidation) {
    query = query.or('is_bank_liquidation.eq.true,description.ilike.%liquidación%,description.ilike.%liquidacion%,description.ilike.%inversión%,description.ilike.%inversion%,description.ilike.%adjudicado%,description.ilike.%remate%,title.ilike.%liquidación%,title.ilike.%liquidacion%,title.ilike.%inversión%,title.ilike.%inversion%,title.ilike.%adjudicado%,title.ilike.%remate%');
  }
  if (filters?.region) {
    query = query.ilike('region', `%${filters.region}%`);
  }
  if (filters?.min_price) {
    query = query.gte('price', filters.min_price);
  }
  if (filters?.max_price) {
    query = query.lte('price', filters.max_price);
  }
  if (filters?.min_bedrooms) {
    query = query.gte('bedrooms', filters.min_bedrooms);
  }
  if (filters?.min_bathrooms) {
    query = query.gte('bathrooms', filters.min_bathrooms);
  }
  if (filters?.min_area) {
    query = query.gte('area', filters.min_area);
  }

  query = query.order('created_at', { ascending: false });

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const result = await query;
  
  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result), count: 0 };
  }

  return { data: result.data, error: null, count: result.count || 0 };
}

/**
 * Get a single property by ID.
 */
export async function getPropertyById(client: PropertyClient, id: string) {
  const result = await client
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Get a single property by slug.
 */
export async function getPropertyBySlug(client: PropertyClient, slug: string) {
  const result = await client
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Get featured properties for homepage.
 */
export async function getFeaturedProperties(client: PropertyClient, limit = 6) {
  const result = await client
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('views', { ascending: false })
    .limit(limit);

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Get recent properties for homepage.
 */
export async function getRecentProperties(client: PropertyClient, limit = 6) {
  const result = await client
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Search properties by title or description.
 */
export async function searchProperties(
  client: PropertyClient,
  searchTerm: string,
  limit = 20
) {
  const result = await client
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Create a new property.
 * Auto-generates slug from title if not provided.
 */
export async function createProperty(
  client: PropertyClient,
  data: Omit<PropertyInsert, 'slug'> & { slug?: string }
) {
  const slug = data.slug || slugify(data.title);

  const result = await client
    .from('properties')
    .insert({ ...data, slug } as PropertyInsert)
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Update an existing property.
 */
export async function updateProperty(
  client: PropertyClient,
  id: string,
  data: PropertyUpdate
) {
  // If title is being updated, regenerate slug unless explicitly provided
  if (data.title && !data.slug) {
    data.slug = slugify(data.title);
  }

  const result = await client
    .from('properties')
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
 * Delete a property.
 */
export async function deleteProperty(client: PropertyClient, id: string) {
  const result = await client
    .from('properties')
    .delete()
    .eq('id', id);

  if (isSupabaseError(result)) {
    return { success: false, error: getErrorMessage(result) };
  }

  return { success: true, error: null };
}

/**
 * Update property views count.
 */
export async function incrementPropertyViews(client: PropertyClient, id: string) {
  const result = await client.rpc('increment_views', { property_id: id });

  if (isSupabaseError(result)) {
    return { success: false, error: getErrorMessage(result) };
  }

  return { success: true, error: null };
}

/**
 * Get properties by agent.
 */
export async function getPropertiesByAgent(
  client: PropertyClient,
  agentId: string,
  includeInactive = false
) {
  let query = client
    .from('properties')
    .select('*')
    .eq('agent_id', agentId);

  if (!includeInactive) {
    query = query.eq('status', 'active');
  }

  query = query.order('created_at', { ascending: false });

  const result = await query;

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Get property statistics.
 */
export async function getPropertyStats(client: PropertyClient) {
  const { data: active, error: activeError } = await client
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  const { data: sold, error: soldError } = await client
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'sold');

  const { data: rented, error: rentedError } = await client
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'rented');

  const hasError = [activeError, soldError, rentedError].some(Boolean);
  if (hasError) {
    return { data: null, error: 'Failed to fetch stats' };
  }

  return {
    data: {
      active: active?.length || 0,
      sold: sold?.length || 0,
      rented: rented?.length || 0,
    },
    error: null,
  };
}

/**
 * Get unique cities from properties.
 */
export async function getPropertyCities(client: PropertyClient) {
  const result = await client
    .from('properties')
    .select('city')
    .eq('status', 'active')
    .order('city');

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  const cities = Array.from(new Set(result.data?.map((p: any) => p.city) || []));
  return { data: cities, error: null };
}

/**
 * Get all property slugs for sitemap generation.
 */
export async function getAllPropertiesSlugs(client: PropertyClient) {
  const result = await client
    .from('properties')
    .select('slug, updated_at, is_featured')
    .eq('status', 'active')
    .order('updated_at', { ascending: false });

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}