import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types';

/**
 * Supabase middleware for authenticating requests.
 * Add this to your middleware.ts to enable auth on protected routes.
 * 
 * Usage in middleware.ts:
 *   import { createMiddlewareClient } from '@/lib/supabase/middleware'
 *   import { updateSession } from '@/lib/supabase/middleware'
 *   
 *   export async function middleware(request: NextRequest) {
 *     return await updateSession(request)
 *   }
 * 
 * Routes configuration:
 *   export const config = {
 *     matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
 *   }
 */

export async function createMiddlewareClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  return { supabase, supabaseResponse };
}

/**
 * Update session for authenticated routes.
 * Call this in middleware to refresh the session and protect routes.
 */
export async function updateSession(request: NextRequest) {
  const { supabase, supabaseResponse } = await createMiddlewareClient(request);

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedRoutes = ['/admin', '/perfil', '/mis-propiedades'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to admin dashboard if accessing login/register while authenticated
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

/**
 * Get the authenticated user from the request.
 * Useful for Server Components and Route Handlers.
 */
export async function getUser(request: NextRequest) {
  const { supabase } = await createMiddlewareClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Require authentication for a route.
 * Throws a redirect if user is not authenticated.
 */
export async function requireAuth(request: NextRequest) {
  const user = await getUser(request);
  
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return user;
}