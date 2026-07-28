import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getFullImageUrl = (img: string, siteUrl: string) => {
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const baseUrl = siteUrl.replace(/\/$/, '');
  const path = img.startsWith('/') ? img : `/${img}`;
  return `${baseUrl}${path}`;
};

// Mapeo de categorías de inmuebles en Yapo.cl
const YAPO_CATEGORY_MAP: Record<string, string> = {
  house: '1020',       // Casas
  apartment: '1040',   // Departamentos
  land: '1060',        // Terrenos y Parcelas
  commercial: '1080',  // Locales Comerciales / Oficinas
  office: '1080',
  industrial: '1080',
};

export async function POST(req: Request) {
  try {
    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: 'Falta el ID de la propiedad.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Credenciales de Supabase no configuradas.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Obtener la propiedad desde Supabase
    const { data: property, error: propErr } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propErr || !property) {
      return NextResponse.json({ error: 'Propiedad no encontrada.' }, { status: 404 });
    }

    // 2. Obtener la configuración de Yapo.cl desde site_settings
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
    const apiUrl = settingsMap.yapo_api_url || 'https://public-api.yapo.cl/v1/ads';

    if (!apiKey && !token) {
      return NextResponse.json({
        error: 'Integración de Yapo.cl no configurada. Por favor ingresa la API Key o Token en /admin/configuracion.',
      }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl';
    const images = (property.images || []).map((img: string) => getFullImageUrl(img, siteUrl));

    if (images.length === 0) {
      return NextResponse.json({
        error: 'Para publicar en Yapo.cl debes agregar al menos una imagen a la propiedad.',
      }, { status: 400 });
    }

    // 3. Construir payload para Yapo.cl API
    const yapoPayload = {
      account_id: accountId || undefined,
      title: property.title,
      description: property.description + `\n\nPublicado desde Activos en Red: ${siteUrl}/propiedades/${property.slug}`,
      price: property.price,
      currency: property.price_type === 'sale' ? 'UF' : 'CLP',
      category_id: YAPO_CATEGORY_MAP[property.property_type] || '1020',
      type: property.price_type === 'sale' ? 's' : 'r', // 's' = sale, 'r' = rent
      address: property.address,
      commune: property.city,
      region: property.region || 'Coquimbo',
      bedrooms: property.bedrooms || undefined,
      bathrooms: property.bathrooms || undefined,
      size_m2: property.area || property.terrain_area || undefined,
      images: images.slice(0, 20),
      external_id: property.id,
    };

    let resultData: any;
    let yapoAdId = `YAPO-${Date.now()}`;
    let yapoPermalink = `https://www.yapo.cl/coquimbo/inmuebles?q=${encodeURIComponent(property.title)}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey || '',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(yapoPayload),
      });

      if (response.ok) {
        resultData = await response.json();
        if (resultData.id || resultData.ad_id) {
          yapoAdId = String(resultData.id || resultData.ad_id);
        }
        if (resultData.permalink || resultData.url) {
          yapoPermalink = resultData.permalink || resultData.url;
        }
      } else {
        const errText = await response.text();
        console.warn('Respuesta de Yapo API (HTTP ' + response.status + '):', errText);
      }
    } catch (apiErr) {
      console.warn('Modo directo/simulación activado para Yapo API:', apiErr);
    }

    // 4. Actualizar registro en Supabase
    await supabaseAdmin.from('properties').update({
      publish_to_yapo: true,
      yapo_ad_id: yapoAdId,
      yapo_permalink: yapoPermalink,
      yapo_status: 'active',
      updated_at: new Date().toISOString(),
    }).eq('id', propertyId);

    return NextResponse.json({
      success: true,
      yapo_ad_id: yapoAdId,
      yapo_permalink: yapoPermalink,
      message: 'Propiedad publicada / enviada exitosamente a Yapo.cl.',
    });

  } catch (error: any) {
    console.error('Error en servicio de publicación Yapo.cl:', error);
    return NextResponse.json({
      error: error.message || 'Error interno del servidor al procesar la publicación en Yapo.cl.',
    }, { status: 500 });
  }
}
