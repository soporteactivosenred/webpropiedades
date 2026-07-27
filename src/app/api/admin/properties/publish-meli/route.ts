import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getFullImageUrl = (img: string, siteUrl: string) => {
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const baseUrl = siteUrl.replace(/\/$/, '');
  const path = img.startsWith('/') ? img : `/${img}`;
  return `${baseUrl}${path}`;
};

// Mapeo de tipos de propiedad a categorías de Mercado Libre Chile (MLC)
const CATEGORY_MAP: Record<string, string> = {
  house: 'MLC1459',       // Casas
  apartment: 'MLC1472',   // Departamentos
  land: 'MLC1494',        // Terrenos y Parcelas
  commercial: 'MLC1467',  // Locales Comerciales
  office: 'MLC1468',      // Oficinas
  industrial: 'MLC1469',  // Bodegas e Industriales
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

    // 2. Obtener la configuración de Mercado Libre desde site_settings
    const { data: settingsList, error: settingsErr } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['meli_app_id', 'meli_client_secret', 'meli_access_token', 'meli_refresh_token']);

    if (settingsErr || !settingsList || settingsList.length === 0) {
      return NextResponse.json({
        error: 'Integración de Mercado Libre no configurada. Ingresa las credenciales en /admin/configuracion.',
      }, { status: 400 });
    }

    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s: any) => {
      settingsMap[s.key] = String(s.value);
    });

    let accessToken = settingsMap.meli_access_token;
    const refreshToken = settingsMap.meli_refresh_token;
    const appId = settingsMap.meli_app_id;
    const clientSecret = settingsMap.meli_client_secret;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({
        error: 'Falta el Token de Acceso de Mercado Libre. Configúralo en el panel de administración.',
      }, { status: 400 });
    }

    // 3. Renovar token si es necesario
    if (refreshToken && appId && clientSecret) {
      try {
        const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: appId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          accessToken = tokenData.access_token;

          // Actualizar tokens en site_settings
          await supabaseAdmin.from('site_settings').upsert([
            { key: 'meli_access_token', value: tokenData.access_token },
            { key: 'meli_refresh_token', value: tokenData.refresh_token },
          ]);
        }
      } catch (tokenErr) {
        console.warn('Error renovando token de Mercado Libre, intentando con token guardado:', tokenErr);
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl';
    const categoryId = CATEGORY_MAP[property.property_type] || 'MLC1459';

    // Preparar imágenes con URLs absolutas
    const pictures = (property.images || []).map((img: string) => ({
      source: getFullImageUrl(img, siteUrl),
    }));

    if (pictures.length === 0) {
      return NextResponse.json({
        error: 'Para publicar en Mercado Libre debes agregar al menos una imagen a la propiedad.',
      }, { status: 400 });
    }

    // 4. Construir payload exigido por la API de Mercado Libre Chile (MLC)
    const meliPayload: any = {
      title: property.title.length > 60 ? property.title.slice(0, 57) + '...' : property.title,
      category_id: categoryId,
      price: property.price,
      currency_id: property.price_type === 'sale' ? 'UF' : 'CLP',
      available_quantity: 1,
      buying_mode: 'classified',
      listing_type_id: property.meli_listing_type || 'gold_special',
      condition: 'not_specified',
      description: {
        plain_text: property.description + `\n\nPublicado por Activos en Red: ${siteUrl}/propiedades/${property.slug}`,
      },
      pictures: pictures.slice(0, 20), // Máximo 20 fotos
      attributes: [
        { id: 'CMG_SITE', value_name: 'portalinmobiliario' }, // Activa publicación simultánea en Portal Inmobiliario Chile
        property.area ? { id: 'COVERED_AREA', value_name: `${property.area} m²` } : null,
        property.terrain_area ? { id: 'TOTAL_AREA', value_name: `${property.terrain_area} m²` } : null,
        property.bedrooms ? { id: 'BEDROOMS', value_name: `${property.bedrooms}` } : null,
        property.bathrooms ? { id: 'BATHROOMS', value_name: `${property.bathrooms}` } : null,
        property.parking_spaces ? { id: 'PARKING_SPACES', value_name: `${property.parking_spaces}` } : null,
      ].filter(Boolean),
      location: {
        address_line: property.address,
        city: { name: property.city },
        state: { name: property.region || 'Coquimbo' },
        country: { id: 'CL' },
      },
    };

    // 5. Publicar en Mercado Libre
    let response;
    let endpoint = 'https://api.mercadolibre.com/items';
    let method = 'POST';

    // Si ya fue publicado, actualizar item existente
    if (property.meli_item_id) {
      endpoint = `https://api.mercadolibre.com/items/${property.meli_item_id}`;
      method = 'PUT';
      delete meliPayload.category_id; // No se puede cambiar categoría en edición
    }

    response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(meliPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error de API Mercado Libre:', result);
      
      const errorMessage = result.message || (result.cause && result.cause[0] ? result.cause[0].cause : 'Error al publicar en Mercado Libre.');
      
      // Actualizar estado en Supabase
      await supabaseAdmin.from('properties').update({
        meli_status: 'error',
      }).eq('id', propertyId);

      return NextResponse.json({
        error: `Error Mercado Libre (${response.status}): ${errorMessage}`,
        details: result,
      }, { status: response.status });
    }

    // 6. Actualizar registro en Supabase con la respuesta exitosa
    const meliItemId = result.id;
    const meliPermalink = result.permalink;

    await supabaseAdmin.from('properties').update({
      publish_to_meli: true,
      meli_item_id: meliItemId,
      meli_permalink: meliPermalink,
      meli_status: 'active',
      updated_at: new Date().toISOString(),
    }).eq('id', propertyId);

    return NextResponse.json({
      success: true,
      meli_item_id: meliItemId,
      meli_permalink: meliPermalink,
      message: 'Propiedad publicada exitosamente en Mercado Libre y Portal Inmobiliario.',
    });

  } catch (error: any) {
    console.error('Error en servicio de publicación Mercado Libre:', error);
    return NextResponse.json({
      error: error.message || 'Error interno del servidor al procesar la publicación en Mercado Libre.',
    }, { status: 500 });
  }
}
