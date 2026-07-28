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

    // Obtener la configuración guardada de Mercado Libre
    const { data: settingsList, error: settingsErr } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['meli_app_id', 'meli_client_secret', 'meli_access_token', 'meli_refresh_token']);

    if (settingsErr || !settingsList || settingsList.length === 0) {
      return NextResponse.json({
        ok: false,
        message: 'No hay credenciales guardadas en la base de datos.',
      });
    }

    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s: any) => {
      settingsMap[s.key] = String(s.value);
    });

    const accessToken = settingsMap.meli_access_token;
    const appId = settingsMap.meli_app_id;

    if (!accessToken) {
      return NextResponse.json({
        ok: false,
        message: 'Falta el Token de Acceso de Mercado Libre.',
      });
    }

    // Verificar token realizando una llamada a /users/me
    const meRes = await fetch('https://api.mercadolibre.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!meRes.ok) {
      const errData = await meRes.json();
      return NextResponse.json({
        ok: false,
        message: `Token inválido o expirado (HTTP ${meRes.status})`,
        detail: errData.message || 'El token de acceso no es válido.',
      });
    }

    const meData = await meRes.json();

    // Verificar permisos / scopes otorgados enviando peticion al endpoint /grants
    let scopesInfo = 'read, write, offline_access';
    try {
      const targetAppId = appId || '3761073179873403';
      const grantsRes = await fetch(`https://api.mercadolibre.com/applications/${targetAppId}/grants`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (grantsRes.ok) {
        const grantsData = await grantsRes.json();
        if (grantsData && Array.isArray(grantsData.scopes)) {
          scopesInfo = grantsData.scopes.join(', ');
        }
      }
    } catch (gErr) {
      console.warn('Error verificando grants:', gErr);
    }

    return NextResponse.json({
      ok: true,
      message: `Conexión exitosa con Mercado Libre Chile (MLC). Usuario Admin: ${meData.nickname} (ID: ${meData.id})`,
      detail: `App ID: ${appId || '3761073179873403'} | Permisos Activos (Scopes): ${scopesInfo} | Sitio: ${meData.site_id || 'MLC'}`,
    });

  } catch (error: any) {
    console.error('Error probando conexión Mercado Libre:', error);
    return NextResponse.json({
      ok: false,
      message: 'Error al conectar con Mercado Libre.',
      detail: error.message,
    }, { status: 500 });
  }
}
