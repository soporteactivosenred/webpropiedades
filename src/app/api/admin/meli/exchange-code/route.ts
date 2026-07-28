import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { code, redirectUri, appId: bodyAppId, clientSecret: bodyClientSecret } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Falta el código de autorización.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Credenciales de Supabase no configuradas.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Obtener credenciales guardadas si no se envían en el body
    const { data: settingsList } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['meli_app_id', 'meli_client_secret', 'meli_code_verifier']);

    const settingsMap: Record<string, string> = {};
    settingsList?.forEach((s: any) => {
      settingsMap[s.key] = String(s.value);
    });

    const appId = bodyAppId || settingsMap.meli_app_id;
    const clientSecret = bodyClientSecret || settingsMap.meli_client_secret;
    const codeVerifier = settingsMap.meli_code_verifier;

    if (!appId || !clientSecret) {
      return NextResponse.json({
        error: 'Por favor guarda primero el App ID y Client Secret antes de autorizar la cuenta.',
      }, { status: 400 });
    }

    const tokenParams: Record<string, string> = {
      grant_type: 'authorization_code',
      client_id: appId.trim(),
      client_secret: clientSecret.trim(),
      code: code.trim(),
      redirect_uri: redirectUri,
    };

    if (codeVerifier) {
      tokenParams['code_verifier'] = codeVerifier.trim();
    }

    // Intercambiar el código por access_token y refresh_token en Mercado Libre
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Error de autenticación OAuth Mercado Libre:', tokenData);
      return NextResponse.json({
        error: tokenData.message || tokenData.error_description || 'Error al intercambiar código de autorización en Mercado Libre.',
        details: tokenData,
      }, { status: tokenRes.status });
    }

    // Guardar tokens en Supabase site_settings
    const updates = [
      { key: 'meli_app_id', value: appId.trim() },
      { key: 'meli_client_secret', value: clientSecret.trim() },
      { key: 'meli_access_token', value: tokenData.access_token },
      { key: 'meli_refresh_token', value: tokenData.refresh_token },
      { key: 'meli_user_id', value: String(tokenData.user_id || '') },
    ];

    for (const setting of updates) {
      await supabaseAdmin.from('site_settings').upsert([setting]);
    }

    return NextResponse.json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      user_id: tokenData.user_id,
      message: '¡Tokens de Mercado Libre obtenidos y guardados exitosamente en la plataforma!',
    });

  } catch (error: any) {
    console.error('Error en intercambio de código Mercado Libre:', error);
    return NextResponse.json({
      error: error.message || 'Error interno al autorizar con Mercado Libre.',
    }, { status: 500 });
  }
}
