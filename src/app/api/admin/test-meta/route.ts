import { NextResponse } from 'next/server';

/**
 * POST /api/admin/test-meta
 * Verifica la conexión con la Meta Graph API comprobando:
 * 1. Que el token es válido
 * 2. Que el Page ID de Facebook es accesible
 * 3. Que el Instagram Business ID está vinculado correctamente
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meta_fb_page_id, meta_ig_business_id, meta_page_access_token } = body;

    const results = {
      token: { ok: false, message: '', detail: '' },
      facebook: { ok: false, message: '', detail: '' },
      instagram: { ok: false, message: '', detail: '' },
    };

    // ─── 1. Verificar el Token ─────────────────────────────────────────────
    if (!meta_page_access_token || meta_page_access_token.trim() === '') {
      results.token = { ok: false, message: 'Token vacío', detail: 'Debes ingresar un token de acceso de Meta.' };
    } else {
      try {
        const tokenRes = await fetch(
          `https://graph.facebook.com/v20.0/me?access_token=${encodeURIComponent(meta_page_access_token)}`
        );
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
          results.token = {
            ok: false,
            message: 'Token inválido',
            detail: tokenData.error.message || 'El token no pudo ser verificado.',
          };
        } else {
          results.token = {
            ok: true,
            message: 'Token válido',
            detail: `Autenticado como: ${tokenData.name || tokenData.id}`,
          };
        }
      } catch {
        results.token = { ok: false, message: 'Error de red', detail: 'No se pudo contactar a la API de Meta.' };
      }
    }

    // ─── 2. Verificar Página de Facebook ──────────────────────────────────
    if (!meta_fb_page_id || meta_fb_page_id.trim() === '') {
      results.facebook = { ok: false, message: 'ID vacío', detail: 'Debes ingresar el ID de tu Página de Facebook.' };
    } else if (!results.token.ok) {
      results.facebook = { ok: false, message: 'Sin verificar', detail: 'Se requiere un token válido para probar esta conexión.' };
    } else {
      try {
        const fbRes = await fetch(
          `https://graph.facebook.com/v20.0/${meta_fb_page_id}?fields=id,name,fan_count,link&access_token=${encodeURIComponent(meta_page_access_token)}`
        );
        const fbData = await fbRes.json();

        if (fbData.error) {
          results.facebook = {
            ok: false,
            message: 'Página no encontrada',
            detail: fbData.error.message || 'No se pudo acceder a la página de Facebook.',
          };
        } else {
          results.facebook = {
            ok: true,
            message: 'Página conectada',
            detail: `"${fbData.name}" — ${fbData.fan_count?.toLocaleString('es-CL') ?? '?'} seguidores`,
          };
        }
      } catch {
        results.facebook = { ok: false, message: 'Error de red', detail: 'No se pudo contactar a la API de Meta.' };
      }
    }

    // ─── 3. Verificar Cuenta de Instagram Business ────────────────────────
    if (!meta_ig_business_id || meta_ig_business_id.trim() === '') {
      results.instagram = { ok: false, message: 'ID vacío', detail: 'Debes ingresar el ID de tu cuenta de Instagram Business.' };
    } else if (!results.token.ok) {
      results.instagram = { ok: false, message: 'Sin verificar', detail: 'Se requiere un token válido para probar esta conexión.' };
    } else {
      try {
        const igRes = await fetch(
          `https://graph.facebook.com/v20.0/${meta_ig_business_id}?fields=id,name,username,followers_count&access_token=${encodeURIComponent(meta_page_access_token)}`
        );
        const igData = await igRes.json();

        if (igData.error) {
          results.instagram = {
            ok: false,
            message: 'Cuenta no encontrada',
            detail: igData.error.message || 'No se pudo acceder a la cuenta de Instagram.',
          };
        } else {
          results.instagram = {
            ok: true,
            message: 'Instagram conectado',
            detail: `@${igData.username || igData.name} — ${igData.followers_count?.toLocaleString('es-CL') ?? '?'} seguidores`,
          };
        }
      } catch {
        results.instagram = { ok: false, message: 'Error de red', detail: 'No se pudo contactar a la API de Meta.' };
      }
    }

    const allOk = results.token.ok && results.facebook.ok && results.instagram.ok;

    return NextResponse.json({ success: allOk, results });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
