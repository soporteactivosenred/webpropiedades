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
      .in('key', ['yapo_api_key', 'yapo_token', 'yapo_account_id', 'yapo_api_url']);

    const settingsMap: Record<string, string> = {};
    settingsList?.forEach((s: any) => {
      settingsMap[s.key] = String(s.value);
    });

    const apiKey = settingsMap.yapo_api_key;
    const token = settingsMap.yapo_token;
    const accountId = settingsMap.yapo_account_id;

    if (!apiKey && !token) {
      return NextResponse.json({
        ok: false,
        message: 'Faltan las credenciales (API Key / Token) de Yapo.cl.',
        detail: 'Ingresa tus credenciales comerciales o del Pack Inmobiliario en el formulario.',
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'Configuración de Yapo.cl (API / Pack Inmobiliario) registrada correctamente.',
      detail: `Account ID: ${accountId || 'Configurado'}, API Key: ${apiKey ? '••••' + apiKey.slice(-4) : 'No definida'}, Token: ${token ? 'Activo' : 'No definido'}`,
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
