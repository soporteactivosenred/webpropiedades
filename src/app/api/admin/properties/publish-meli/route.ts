import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getFullImageUrl = (img: string, siteUrl: string) => {
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const baseUrl = siteUrl.replace(/\/$/, '');
  const path = img.startsWith('/') ? img : `/${img}`;
  return `${baseUrl}${path}`;
};

// Obtener la categoría hoja (leaf category) correcta para Mercado Libre Chile (MLC) según tipo de propiedad y operación
const getMeliCategoryId = (propertyType: string, priceType: string): string => {
  const isSale = priceType === 'sale';
  switch (propertyType) {
    case 'house':
      return isSale ? 'MLC157520' : 'MLC183184';
    case 'apartment':
      return isSale ? 'MLC157522' : 'MLC183186';
    case 'land':
      return isSale ? 'MLC152993' : 'MLC152994';
    case 'commercial':
      return isSale ? 'MLC50612' : 'MLC50611';
    case 'office':
      return isSale ? 'MLC157413' : 'MLC183187';
    case 'industrial':
      return isSale ? 'MLC50619' : 'MLC50618';
    default:
      return isSale ? 'MLC157520' : 'MLC183184';
  }
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
    const categoryId = getMeliCategoryId(property.property_type, property.price_type);

    // Preparar imágenes con URLs absolutas
    const pictures = (property.images || []).map((img: string) => ({
      source: getFullImageUrl(img, siteUrl),
    }));

    if (pictures.length === 0) {
      return NextResponse.json({
        error: 'Para publicar en Mercado Libre debes agregar al menos una imagen a la propiedad.',
      }, { status: 400 });
    }

    // 4. Construir atributos exigidos por la API de Mercado Libre Chile (MLC)
    const featuresLower = (property.features || []).map((f: string) => f.toLowerCase());
    const isFurnished = featuresLower.some((f: string) => f.includes('amoblado') || f.includes('mueble') || f.includes('furnish'));
    const isPetsAllowed = featuresLower.some((f: string) => f.includes('mascota') || f.includes('perro') || f.includes('gato') || f.includes('pet'));
    const hasWarehouse = featuresLower.some((f: string) => f.includes('bodega') || f.includes('cellar') || f.includes('warehouse'));

    const attributes: any[] = [
      { id: 'CMG_SITE', value_name: 'portalinmobiliario' } // Activa publicación simultánea en Portal Inmobiliario Chile
    ];

    if (property.area) {
      attributes.push({ 
        id: 'COVERED_AREA', 
        value_name: `${property.area} m²`,
        value_struct: { number: Number(property.area), unit: 'm²' }
      });
    }

    if (property.terrain_area) {
      attributes.push({ 
        id: 'TOTAL_AREA', 
        value_name: `${property.terrain_area} m²`,
        value_struct: { number: Number(property.terrain_area), unit: 'm²' }
      });
    }

    if (property.property_type === 'house' || property.property_type === 'apartment' || property.property_type === 'office') {
      if (property.bedrooms) {
        attributes.push({ id: 'BEDROOMS', value_name: `${property.bedrooms}` });
      }
      
      const bathrooms = property.bathrooms || 1;
      attributes.push({ id: 'FULL_BATHROOMS', value_name: `${bathrooms}` });

      const parking = property.parking_spaces !== null && property.parking_spaces !== undefined ? property.parking_spaces : 0;
      attributes.push({ id: 'PARKING_LOTS', value_name: `${parking}` });
    }

    // Atributos específicos exigidos para residenciales (especialmente arriendo de departamentos)
    if (property.property_type === 'house' || property.property_type === 'apartment') {
      attributes.push({ id: 'IS_SUITABLE_FOR_PETS', value_name: isPetsAllowed ? 'Sí' : 'No' });
      attributes.push({ id: 'FURNISHED', value_name: isFurnished ? 'Sí' : 'No' });
      attributes.push({ id: 'WAREHOUSES', value_name: hasWarehouse ? '1' : '0' });
      attributes.push({ id: 'MAINTENANCE_FEE', value_name: '0', value_struct: { number: 0, unit: 'CLP' } });
    }

    // Construir payload
    const meliPayload: any = {
      site_id: 'MLC', // Muy importante para validar atributos correctamente
      title: property.title.length > 60 ? property.title.slice(0, 57) + '...' : property.title,
      category_id: categoryId,
      price: property.price,
      currency_id: property.price_type === 'sale' ? 'CLF' : 'CLP',
      available_quantity: 1,
      buying_mode: 'classified',
      listing_type_id: property.meli_listing_type || 'gold_special',
      condition: 'not_specified',
      description: {
        plain_text: property.description + `\n\nPublicado por Activos en Red: ${siteUrl}/propiedades/${property.slug}`,
      },
      pictures: pictures.slice(0, 20), // Máximo 20 fotos
      attributes: attributes,
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
    let descriptionPayload = meliPayload.description;

    // Si ya fue publicado, actualizar item existente
    if (property.meli_item_id) {
      endpoint = `https://api.mercadolibre.com/items/${property.meli_item_id}`;
      method = 'PUT';
      delete meliPayload.category_id; // No se puede cambiar categoría en edición
      delete meliPayload.description; // No se permite editar la descripción en el endpoint principal de PUT /items
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
      
      let errorMessage = result.message || 'Error al publicar en Mercado Libre.';
      if (result.cause && Array.isArray(result.cause) && result.cause.length > 0) {
        const details = result.cause
          .map((c: any) => c.message || c.cause || c.code || '')
          .filter(Boolean)
          .join(', ');
        if (details) {
          errorMessage = `${errorMessage}: ${details}`;
        }
      }
      
      // Actualizar estado en Supabase
      await supabaseAdmin.from('properties').update({
        meli_status: 'error',
      }).eq('id', propertyId);

      return NextResponse.json({
        error: `Error Mercado Libre (${response.status}): ${errorMessage}`,
        details: result,
      }, { status: response.status });
    }

    // Si es una actualización (PUT) exitosa, proceder a actualizar la descripción por separado
    if (property.meli_item_id && descriptionPayload) {
      try {
        const descEndpoint = `https://api.mercadolibre.com/items/${property.meli_item_id}/description`;
        const descResponse = await fetch(descEndpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(descriptionPayload),
        });

        if (!descResponse.ok) {
          const descError = await descResponse.text();
          console.warn('No se pudo actualizar la descripción de la propiedad en Mercado Libre:', descError);
        }
      } catch (descErr) {
        console.error('Error de red al actualizar descripción de Mercado Libre:', descErr);
      }
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
