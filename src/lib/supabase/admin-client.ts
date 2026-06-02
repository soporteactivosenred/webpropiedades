'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types';

/**
 * Create a Supabase client for use in the browser admin pages.
 * This client is for client-side rendering and uses the anon key.
 */
export function createAdminBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Singleton instance for browser admin client.
 */
let browserClient: ReturnType<typeof createAdminBrowserClient> | null = null;

export function getAdminClient() {
  if (!browserClient) {
    browserClient = createAdminBrowserClient();
  }
  return browserClient;
}