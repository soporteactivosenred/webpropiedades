import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl';

  if (error || !code) {
    console.error('Error recibido en callback OAuth Mercado Libre:', error, errorDescription);
    return NextResponse.redirect(`${siteUrl}/admin/configuracion?meli_error=${encodeURIComponent(errorDescription || error || 'Falta codigo de autorizacion')}`);
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Obtener credenciales de la App guardadas en Supabase
    const { data: settingsList } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['meli_app_id', 'meli_client_secret', 'meli_redirect_uri', 'meli_code_verifier']);

    const settingsMap: Record<string, string> = {};
    settingsList?.forEach((s: any) => {
      settingsMap[s.key] = String(s.value);
    });

    const appId = settingsMap.meli_app_id || '3761073179873403';
    const clientSecret = settingsMap.meli_client_secret;
    const redirectUri = settingsMap.meli_redirect_uri || 'https://activosenred.cl/api/mercadolibre/callback';
    const codeVerifier = settingsMap.meli_code_verifier;

    if (!clientSecret) {
      return NextResponse.redirect(`${siteUrl}/admin/configuracion?meli_error=Falta_Client_Secret`);
    }

    const tokenBodyParams: Record<string, string> = {
      grant_type: 'authorization_code',
      client_id: appId.trim(),
      client_secret: clientSecret.trim(),
      code: code.trim(),
      redirect_uri: redirectUri.trim(),
    };

    if (codeVerifier) {
      tokenBodyParams['code_verifier'] = codeVerifier.trim();
    }

    // Intercambiar el código por el Access Token en Mercado Libre
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenBodyParams),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Error al intercambiar token Mercado Libre:', tokenData);
      return NextResponse.redirect(`${siteUrl}/admin/configuracion?meli_error=${encodeURIComponent(tokenData.message || tokenData.error || 'Error al obtener token')}`);
    }

    // Guardar los tokens en Supabase site_settings
    const updates = [
      { key: 'meli_access_token', value: tokenData.access_token },
      { key: 'meli_refresh_token', value: tokenData.refresh_token || '' },
      { key: 'meli_user_id', value: String(tokenData.user_id || '') },
    ];

    for (const update of updates) {
      await supabaseAdmin.from('site_settings').upsert(update, { onConflict: 'key' });
    }

    return NextResponse.redirect(`${siteUrl}/admin/configuracion?meli_connected=1`);

  } catch (err: any) {
    console.error('Excepción en callback de Mercado Libre:', err);
    return NextResponse.redirect(`${siteUrl}/admin/configuracion?meli_error=${encodeURIComponent(err.message || 'Error del servidor')}`);
  }
}
