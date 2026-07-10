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
      
      return new NextResponse(`
        <div style="font-family: system-ui, -apple-system, sans-serif; max-w: 600px; margin: 40px auto; padding: 30px; border: 1px solid #e4e4e7; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h1 style="color: #ef4444; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Error de Permisos</h1>
          <p style="color: #3f3f46; font-size: 15px; line-height: 1.6;">
            No se pudo actualizar tu rol de forma automática porque la variable de entorno <strong>SUPABASE_SERVICE_ROLE_KEY</strong> no está configurada en Vercel, y las políticas de seguridad (RLS) de tu base de datos de Supabase impiden la escritura directa desde el navegador.
          </p>
          
          <div style="margin: 24px 0; padding-top: 16px; border-top: 1px solid #e4e4e7;">
            <h3 style="font-size: 16px; color: #18181b; margin-top: 0; margin-bottom: 8px;">Opción 1: Configurar en Vercel (Recomendado)</h3>
            <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
              Agrega la variable de entorno <strong>SUPABASE_SERVICE_ROLE_KEY</strong> en tu panel de Vercel con la clave <code>service_role</code> (la obtienes en Supabase -> Project Settings -> API). Una vez que Vercel termine de redesplegar el sitio, vuelve a cargar esta URL.
            </p>
          </div>

          <div style="margin: 24px 0; padding-top: 16px; border-top: 1px solid #e4e4e7;">
            <h3 style="font-size: 16px; color: #18181b; margin-top: 0; margin-bottom: 8px;">Opción 2: Ejecutar SQL en Supabase (Inmediato)</h3>
            <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin-bottom: 12px;">
              Copia el siguiente código SQL autogenerado para tu usuario actual y ejecútalo en el <strong>SQL Editor</strong> de tu consola de Supabase:
            </p>
            <pre style="background: #f4f4f5; color: #18181b; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; border: 1px solid #e4e4e7; overflow-x: auto; user-select: all; margin: 0;">
INSERT INTO public.profiles (id, email, full_name, role, updated_at)
VALUES (
  '${user.id}',
  '${user.email}',
  '${user.user_metadata?.full_name || 'Administrador'}',
  'admin',
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', updated_at = NOW();</pre>
          </div>
        </div>
      `, {
        status: 500,
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
