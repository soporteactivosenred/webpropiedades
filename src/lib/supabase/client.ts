import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types';

/**
 * Create a Supabase client for use in the browser.
 * This client is for client-side rendering and uses the anon key.
 * 
 * Usage:
 *   const supabase = createClient()
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Singleton instance for browser client.
 * Use this in client components to avoid recreating the client.
 */
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}

export { createClient as createClientComponentClient };