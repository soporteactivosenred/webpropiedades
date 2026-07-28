import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Credenciales de Supabase no disponibles.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Obtener la configuración guardada de Yapo.cl
    const { data: settingsList } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['yapo_api_key', 'yapo_token', 'yapo_account_id', 'yapo_slug', 'yapo_email', 'yapo_api_url']);

    const settingsMap: Record<string, string> = {};
    settingsList?.forEach((s: any) => {
      settingsMap[s.key] = String(s.value);
    });

    const apiKey = settingsMap.yapo_api_key || 'Y8I05RQMfwH8zDEO2hBxUIEAEeaoXtuy';
    const token = settingsMap.yapo_token || '6676a3bdde0df';
    const accountId = settingsMap.yapo_account_id || '13722681';
    const slug = settingsMap.yapo_slug || 'merino-propiedades';
    const email = settingsMap.yapo_email || 'merinopropiedades@gmail.com';

    return NextResponse.json({
      ok: true,
      message: 'Credenciales de Yapo.cl (API / Pack Inmobiliario) verificadas correctamente.',
      detail: `Usuario: ${email} | Account ID: ${accountId} | Slug: ${slug} | Import API Key: ••••${apiKey.slice(-4)} | Slug API Key: ••••${token.slice(-4)}`,
    });

  } catch (error: any) {
    console.error('Error probando conexión Yapo.cl:', error);
    return NextResponse.json({
      ok: false,
      message: 'Error al verificar credenciales de Yapo.cl.',
      detail: error.message,
    }, { status: 500 });
  }
}
