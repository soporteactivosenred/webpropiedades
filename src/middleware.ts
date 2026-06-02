import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types';

export const config = {
  matcher: [
    '/admin/:path*'
  ],
};

/**
 * Admin middleware to protect admin routes.
 * Only authenticated users can access /admin/* (except /admin/login)
 */
export async function adminMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public admin routes
  if (pathname === '/admin/login') {
    // Check if already logged in
    const supabase = await createSupabaseServerClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Redirect to admin dashboard if already logged in
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  }

  // Protect all other admin routes
  const supabase = await createSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

async function createSupabaseServerClient(request: NextRequest) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// Default export for Next.js middleware
export default function middleware(request: NextRequest) {
  return adminMiddleware(request);
}