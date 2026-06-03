import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { Database } from '@/types';

export async function POST() {
  const supabase = await createServerClient<Database>();
  
  await supabase.auth.signOut();
  
  const url = new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl');
  
  return NextResponse.redirect(url);
}

export async function GET() {
  return NextResponse.redirect('/admin/login');
}