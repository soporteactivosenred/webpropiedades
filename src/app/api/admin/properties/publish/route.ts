import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getFullImageUrl = (img: string, siteUrl: string) => {
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const baseUrl = siteUrl.replace(/\/$/, '');
  const path = img.startsWith('/') ? img : `/${img}`;
  return `${baseUrl}${path}`;
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
      console.warn('Supabase credentials missing during property publish request.');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 1. Fetch property details
    const { data: property, error: propErr } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propErr || !property) {
      return NextResponse.json({ error: 'Propiedad no encontrada.' }, { status: 404 });
    }

    // Check if publishing is requested
    if ((!property.publish_to_fb || property.fb_post_id) && (!property.publish_to_ig || property.ig_media_id)) {
      return NextResponse.json({ success: true, message: 'No hay publicaciones pendientes para esta propiedad.' });
    }

    // 2. Fetch Meta integration configurations from site_settings
    const { data: settingsList, error: settingsErr } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['meta_fb_page_id', 'meta_ig_business_id', 'meta_page_access_token']);

    if (settingsErr || !settingsList || settingsList.length === 0) {
      return NextResponse.json({
        error: 'Integración de Meta no configurada. Configura las credenciales en el panel de administración.',
      }, { status: 400 });
    }

    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s: any) => {
      settingsMap[s.key] = String(s.value);
    });

    const fb_page_id = settingsMap.meta_fb_page_id;
    const ig_business_id = settingsMap.meta_ig_business_id;
    const page_access_token = settingsMap.meta_page_access_token;

    if (!page_access_token) {
      return NextResponse.json({ error: 'Falta el Token de Acceso de Meta.' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl';
    const propertyUrl = `${siteUrl}/propiedades/${property.slug}`;

    // Build automated caption if social_caption is empty
    const priceText = property.price_type === 'sale'
      ? `UF ${property.price.toLocaleString('es-CL')}`
      : `$${property.price.toLocaleString('es-CL')}/mes`;

    const propTypeLabel = property.property_type === 'house' ? 'Casa'
      : property.property_type === 'apartment' ? 'Departamento'
      : property.property_type === 'land' ? 'Terreno'
      : property.property_type === 'commercial' ? 'Local Comercial'
      : property.property_type === 'office' ? 'Oficina'
      : 'Propiedad Industrial';

    const defaultCaption = [
      `✨ ¡NUEVA OPORTUNIDAD EN ${property.city.toUpperCase()}! ✨`,
      `🏠 ${propTypeLabel} en ${property.price_type === 'sale' ? 'Venta' : 'Arriendo'}`,
      `📍 Ubicación: ${property.address}, ${property.city}`,
      `💰 Precio: ${priceText}`,
      property.bedrooms ? `🛌 ${property.bedrooms} Dormitorios` : null,
      property.bathrooms ? `🚿 ${property.bathrooms} Baños` : null,
      property.area ? `📐 ${property.area} m² construidos` : null,
      ``,
      `📲 ¡Contáctanos hoy mismo para coordinar una visita!`,
      `#Propiedades #Inmobiliaria #${property.city.replace(/\s+/g, '')} #ActivosEnRed #Chile`,
    ].filter(Boolean).join('\n');

    const captionToUse = property.social_caption && property.social_caption.trim() !== ''
      ? property.social_caption
      : defaultCaption;

    // Image processing: max 10 images for Meta API
    const rawImages: string[] = (property.images && Array.isArray(property.images) ? property.images : []).slice(0, 10);
    const fullImages: string[] = rawImages.map(img => getFullImageUrl(img, siteUrl));

    const results: any = {};
    const updates: any = {};

    // 3. Autopublish to Facebook (Multi-photo album if > 1 image)
    if (property.publish_to_fb && !property.fb_post_id && fb_page_id) {
      try {
        let pageToken = page_access_token;
        try {
          const ptRes = await fetch(
            `https://graph.facebook.com/v20.0/${fb_page_id}?fields=access_token&access_token=${encodeURIComponent(page_access_token)}`
          );
          const ptData = await ptRes.json();
          if (ptData.access_token) {
            pageToken = ptData.access_token;
          }
        } catch {
          // Fallback to original token
        }

        if (fullImages.length > 1) {
          // Multi-photo upload for Facebook
          const photoPromises = fullImages.map(async (imgUrl) => {
            try {
              const res = await fetch(`https://graph.facebook.com/v20.0/${fb_page_id}/photos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  url: imgUrl,
                  published: false,
                  access_token: pageToken,
                }),
              });
              const data = await res.json();
              return res.ok && data.id ? data.id : null;
            } catch {
              return null;
            }
          });

          const photoIds = (await Promise.all(photoPromises)).filter(Boolean);

          if (photoIds.length > 1) {
            const fbRes = await fetch(`https://graph.facebook.com/v20.0/${fb_page_id}/feed`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: `${captionToUse}\n\n👉 Ver detalles: ${propertyUrl}`,
                attached_media: photoIds.map(id => ({ media_fbid: id })),
                access_token: pageToken,
              }),
            });

            const fbData = await fbRes.json();
            if (fbRes.ok && fbData.id) {
              results.facebook = { success: true, id: fbData.id, photosCount: photoIds.length };
              updates.fb_post_id = fbData.id;
            } else {
              results.facebook = { success: false, error: fbData.error?.message || JSON.stringify(fbData) };
            }
          } else {
            // Fallback to single link post
            const fbRes = await fetch(`https://graph.facebook.com/v20.0/${fb_page_id}/feed`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: `${captionToUse}\n\n👉 Ver detalles: ${propertyUrl}`,
                link: propertyUrl,
                access_token: pageToken,
              }),
            });
            const fbData = await fbRes.json();
            if (fbRes.ok && fbData.id) {
              results.facebook = { success: true, id: fbData.id };
              updates.fb_post_id = fbData.id;
            } else {
              results.facebook = { success: false, error: fbData.error?.message || JSON.stringify(fbData) };
            }
          }
        } else {
          // Single link post
          const fbRes = await fetch(`https://graph.facebook.com/v20.0/${fb_page_id}/feed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `${captionToUse}\n\n👉 Ver detalles: ${propertyUrl}`,
              link: propertyUrl,
              access_token: pageToken,
            }),
          });

          const fbData = await fbRes.json();
          if (fbRes.ok && fbData.id) {
            results.facebook = { success: true, id: fbData.id };
            updates.fb_post_id = fbData.id;
          } else {
            results.facebook = { success: false, error: fbData.error?.message || JSON.stringify(fbData) };
          }
        }
      } catch (fbErr: any) {
        results.facebook = { success: false, error: fbErr.message };
      }
    }

    // 4. Autopublish to Instagram (Carousel if multiple images)
    if (property.publish_to_ig && !property.ig_media_id && ig_business_id && fullImages.length > 0) {
      try {
        if (fullImages.length > 1) {
          // Carousel post for Instagram
          const containerPromises = fullImages.map(async (imgUrl) => {
            try {
              const res = await fetch(`https://graph.facebook.com/v20.0/${ig_business_id}/media`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  image_url: imgUrl,
                  is_carousel_item: true,
                  access_token: page_access_token,
                }),
              });
              const data = await res.json();
              return res.ok && data.id ? data.id : null;
            } catch {
              return null;
            }
          });

          const containerIds = (await Promise.all(containerPromises)).filter(Boolean);

          if (containerIds.length >= 2) {
            // Create Carousel Container
            const carouselRes = await fetch(`https://graph.facebook.com/v20.0/${ig_business_id}/media`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                media_type: 'CAROUSEL',
                children: containerIds,
                caption: captionToUse,
                access_token: page_access_token,
              }),
            });

            const carouselData = await carouselRes.json();

            if (carouselRes.ok && carouselData.id) {
              const publishRes = await fetch(`https://graph.facebook.com/v20.0/${ig_business_id}/media_publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  creation_id: carouselData.id,
                  access_token: page_access_token,
                }),
              });

              const publishData = await publishRes.json();
              if (publishRes.ok && publishData.id) {
                results.instagram = { success: true, id: publishData.id, carouselCount: containerIds.length };
                updates.ig_media_id = publishData.id;
              } else {
                results.instagram = { success: false, error: publishData.error?.message || JSON.stringify(publishData) };
              }
            } else {
              results.instagram = { success: false, error: carouselData.error?.message || JSON.stringify(carouselData) };
            }
          } else {
            // Fallback to single image post
            const containerRes = await fetch(`https://graph.facebook.com/v20.0/${ig_business_id}/media`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image_url: fullImages[0],
                caption: captionToUse,
                access_token: page_access_token,
              }),
            });
            const containerData = await containerRes.json();
            if (containerRes.ok && containerData.id) {
              const publishRes = await fetch(`https://graph.facebook.com/v20.0/${ig_business_id}/media_publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  creation_id: containerData.id,
                  access_token: page_access_token,
                }),
              });
              const publishData = await publishRes.json();
              if (publishRes.ok && publishData.id) {
                results.instagram = { success: true, id: publishData.id };
                updates.ig_media_id = publishData.id;
              } else {
                results.instagram = { success: false, error: publishData.error?.message || JSON.stringify(publishData) };
              }
            } else {
              results.instagram = { success: false, error: containerData.error?.message || JSON.stringify(containerData) };
            }
          }
        } else {
          // Single Image Post
          const containerRes = await fetch(`https://graph.facebook.com/v20.0/${ig_business_id}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: fullImages[0],
              caption: captionToUse,
              access_token: page_access_token,
            }),
          });

          const containerData = await containerRes.json();
          if (containerRes.ok && containerData.id) {
            const publishRes = await fetch(`https://graph.facebook.com/v20.0/${ig_business_id}/media_publish`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                creation_id: containerData.id,
                access_token: page_access_token,
              }),
            });

            const publishData = await publishRes.json();
            if (publishRes.ok && publishData.id) {
              results.instagram = { success: true, id: publishData.id };
              updates.ig_media_id = publishData.id;
            } else {
              results.instagram = { success: false, error: publishData.error?.message || JSON.stringify(publishData) };
            }
          } else {
            results.instagram = { success: false, error: containerData.error?.message || JSON.stringify(containerData) };
          }
        }
      } catch (igErr: any) {
        results.instagram = { success: false, error: igErr.message };
      }
    }

    // 5. Update property record in database if any social ID was returned
    if (Object.keys(updates).length > 0) {
      await supabaseAdmin
        .from('properties')
        .update(updates)
        .eq('id', property.id);
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (err: any) {
    console.error('Error in property publish API Route:', err);
    return NextResponse.json({ error: err.message || 'Error interno de servidor.' }, { status: 500 });
  }
}
