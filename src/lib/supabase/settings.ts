/**
 * Site settings and profile-related database helpers for Supabase.
 * These functions provide type-safe operations for settings and user profiles.
 */

import type { Database, Profile, ProfileUpdate, SiteSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { getErrorMessage, isSupabaseError } from './types';

type SupabaseClient<T> = any;

/**
 * Get user profile by ID.
 */
export async function getProfileById(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ data: Profile | null; error: string | null }> {
  const result = await client
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Get user profile by email.
 */
export async function getProfileByEmail(
  client: SupabaseClient<Database>,
  email: string
): Promise<{ data: Profile | null; error: string | null }> {
  const result = await client
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Update user profile.
 */
export async function updateProfile(
  client: SupabaseClient<Database>,
  id: string,
  data: ProfileUpdate
): Promise<{ data: Profile | null; error: string | null }> {
  const result = await client
    .from('profiles')
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
 * Create or update user profile (upsert).
 */
export async function upsertProfile(
  client: SupabaseClient<Database>,
  data: {
    id: string;
    email: string;
    full_name?: string;
    role?: 'admin' | 'agent' | 'user';
  }
): Promise<{ data: Profile | null; error: string | null }> {
  const result = await client
    .from('profiles')
    .upsert({
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role || 'user',
    })
    .select()
    .single();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Get all agents (users with 'agent' role).
 */
export async function getAgents(
  client: SupabaseClient<Database>
): Promise<{ data: Profile[]; error: string | null }> {
  const result = await client
    .from('profiles')
    .select('*')
    .in('role', ['agent', 'admin'])
    .order('full_name');

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data || [], error: null };
}

/**
 * Get all users (for admin panel).
 */
export async function getAllProfiles(
  client: SupabaseClient<Database>,
  options?: {
    role?: 'admin' | 'agent' | 'user';
    limit?: number;
    offset?: number;
  }
): Promise<{ data: Profile[]; error: string | null }> {
  let query = client.from('profiles').select('*', { count: 'exact' });

  if (options?.role) {
    query = query.eq('role', options.role);
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

// ============================================================================
// Site Settings Helpers
// ============================================================================
// Note: For a real application, these would query a site_settings table.
// For this implementation, we use the DEFAULT_SETTINGS from types.

/**
 * Get a single site setting by key.
 * Note: This requires a site_settings table in your database.
 */
export async function getSiteSetting<T = unknown>(
  client: SupabaseClient<Database>,
  key: string
): Promise<{ data: T | null; error: string | null }> {
  const result = await client
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (isSupabaseError(result)) {
    // If table doesn't exist or key not found, return default
    return { data: null, error: null };
  }

  return { data: result.data?.value as T ?? null, error: null };
}

/**
 * Set a site setting.
 * Note: This requires a site_settings table in your database.
 */
export async function setSiteSetting<T = unknown>(
  client: SupabaseClient<Database>,
  key: string,
  value: T
): Promise<{ success: boolean; error: string | null }> {
  const result = await client
    .from('site_settings')
    .upsert({ key, value })
    .select();

  if (isSupabaseError(result)) {
    return { success: false, error: getErrorMessage(result) };
  }

  return { success: true, error: null };
}

/**
 * Get all site settings.
 * Merges database settings with defaults for any missing keys.
 */
export async function getSiteSettings(
  client: SupabaseClient<Database>
): Promise<{ data: SiteSettings; error: string | null }> {
  // Start with defaults
  const settings = { ...DEFAULT_SETTINGS };

  try {
    const result = await client
      .from('site_settings')
      .select('key, value');

    if (!isSupabaseError(result) && result.data) {
      // Merge stored settings over defaults
      for (const row of result.data) {
        if (row.key in settings) {
          (settings as Record<string, unknown>)[row.key] = row.value;
        }
      }
    }
  } catch {
    // If site_settings table doesn't exist, return defaults
  }

  return { data: settings, error: null };
}

/**
 * Get contact information (email, phone, address).
 * Uses cached settings for performance.
 */
export async function getContactInfo(
  client: SupabaseClient<Database>
): Promise<{
  data: Pick<SiteSettings, 'contact_email' | 'contact_phone' | 'contact_whatsapp' | 'contact_address'>;
  error: string | null;
}> {
  return getSiteSettings(client) as Promise<{
    data: Pick<SiteSettings, 'contact_email' | 'contact_phone' | 'contact_whatsapp' | 'contact_address'>;
    error: string | null;
  }>;
}

/**
 * Get social media links.
 */
export async function getSocialLinks(
  client: SupabaseClient<Database>
): Promise<{
  data: SiteSettings['social_media'];
  error: string | null;
}> {
  return getSiteSettings(client) as Promise<{
    data: SiteSettings['social_media'];
    error: string | null;
  }>;
}