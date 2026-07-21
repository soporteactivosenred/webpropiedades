import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: 'Falta el ID del artículo.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Supabase credentials missing during build/runtime request.');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 1. Fetch the blog post details
    const { data: post, error: postErr } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postErr || !post) {
      return NextResponse.json({ error: 'Artículo no encontrado.' }, { status: 404 });
    }

    // If neither Facebook nor Instagram is selected, or if they are already published, we do nothing
    if ((!post.publish_to_fb || post.fb_post_id) && (!post.publish_to_ig || post.ig_media_id)) {
      return NextResponse.json({ success: true, message: 'No hay publicaciones pendientes por realizar.' });
    }

    // 2. Fetch Meta integration configurations from site_settings
    const { data: settingsList, error: settingsErr } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['meta_fb_page_id', 'meta_ig_business_id', 'meta_page_access_token']);

    if (settingsErr || !settingsList || settingsList.length === 0) {
      return NextResponse.json({
        error: 'Integración de Meta no configurada. Por favor ve a configuración de administración e ingresa tus tokens de acceso.',
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

    const results: any = {};
    const updates: any = {};

    // 3. Autopublish to Facebook
    if (post.publish_to_fb && !post.fb_post_id && fb_page_id) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl';
        const postUrl = `${siteUrl}/blog/${post.slug}`;

        // Nota: No se envía 'picture' porque Facebook solo permite
        // personalizar la imagen si el dominio está verificado (#100).
        // Facebook generará automáticamente la preview usando las
        // etiquetas Open Graph del artículo del blog.
        const fbRes = await fetch(`https://graph.facebook.com/v20.0/${fb_page_id}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: post.social_caption || post.excerpt || post.title,
            link: postUrl,
            access_token: page_access_token,
          }),
        });

        const fbData = await fbRes.json();
        if (fbRes.ok && fbData.id) {
          results.facebook = { success: true, id: fbData.id };
          updates.fb_post_id = fbData.id;
        } else {
          results.facebook = { success: false, error: fbData.error?.message || JSON.stringify(fbData) };
        }
      } catch (fbErr: any) {
        results.facebook = { success: false, error: fbErr.message };
      }
    }


    // 4. Autopublish to Instagram (requires a public image URL)
    const igImage = post.ig_image_url || post.featured_image;
    if (post.publish_to_ig && !post.ig_media_id && ig_business_id && igImage) {
      try {
        // Step A: Create Media Container
        const containerRes = await fetch(`https://graph.facebook.com/v18.0/${ig_business_id}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: igImage,
            caption: post.social_caption || post.excerpt || post.title,
            access_token: page_access_token,
          }),
        });

        const containerData = await containerRes.json();
        if (containerRes.ok && containerData.id) {
          const creationId = containerData.id;

          // Step B: Publish Container
          const publishRes = await fetch(`https://graph.facebook.com/v18.0/${ig_business_id}/media_publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creation_id: creationId,
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
      } catch (igErr: any) {
        results.instagram = { success: false, error: igErr.message };
      }
    }

    // 5. Update blog post in database with social IDs if successful
    if (Object.keys(updates).length > 0) {
      await supabaseAdmin
        .from('blog_posts')
        .update(updates)
        .eq('id', post.id);
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (err: any) {
    console.error('Error in blog publish API Route:', err);
    return NextResponse.json({ error: err.message || 'Error interno de servidor.' }, { status: 500 });
  }
}
