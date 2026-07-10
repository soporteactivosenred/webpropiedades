import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = (await createServerClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('<h1>Error</h1><p>Debes iniciar sesión primero en <a href="/admin/login">/admin/login</a></p>', {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      // Fallback direct upsert using normal client if RLS allows it
      const { error: directError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          role: 'admin',
          updated_at: new Date().toISOString(),
        });
      
      if (directError) {
        return new NextResponse(`<h1>Error de Permisos</h1><p>No se pudo actualizar el perfil y la clave SUPABASE_SERVICE_ROLE_KEY no está configurada.</p><p>Detalle: ${directError.message}</p>`, {
          status: 500,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      return new NextResponse('<h1>¡Éxito!</h1><p>Tu cuenta ha sido promovida a Administrador. Por favor recarga el panel de administración (/admin) y ya deberías ver la pestaña de Usuarios.</p>', {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    );

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Administrador',
        role: 'admin',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      return new NextResponse(`<h1>Error</h1><p>No se pudo actualizar el perfil: ${profileError.message}</p>`, {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new NextResponse('<h1>¡Éxito!</h1><p>Tu cuenta ha sido promovida a Administrador. Por favor recarga el panel de administración (/admin) y ya deberías ver la pestaña de Usuarios.</p>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (error: any) {
    return new NextResponse(`<h1>Error Interno</h1><p>${error.message || 'Ocurrió un error inesperado.'}</p>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}
