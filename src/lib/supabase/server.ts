import { createServerClient as supabaseCreateServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types';

/**
 * Create a Supabase client for use in Server Components, Route Handlers, and Server Actions.
 * This client can access cookies and uses the anon key.
 * 
 * Usage in Server Components:
 *   const supabase = await createServerClient()
 * 
 * Usage in Route Handlers/Actions:
 *   const supabase = createServerClient()
 */
export async function createServerClient<T = Database>() {
  const cookieStore = await cookies();
  
  return supabaseCreateServerClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle cookies in Server Components (read-only)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Handle cookies in Server Components (read-only)
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client for use in Server Components with async cookie access.
 * Use this variant when you need to await the cookies() promise.
 */
export function createServerClientFromCookies<T = Database>(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return supabaseCreateServerClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle cookies in Server Components (read-only)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Handle cookies in Server Components (read-only)
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase admin client with service role key.
 * This client bypasses RLS and should only be used in secure server contexts.
 * 
 * Usage:
 *   const supabase = createAdminClient()
 */
export function createAdminClient<T = Database>() {
  return supabaseCreateServerClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined; },
        set() { /* No-op for admin client */ },
        remove() { /* No-op for admin client */ },
      },
    }
  );
}