import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const YAPO_CATEGORY_MAP: Record<string, string> = {
  house: '1020',       // Casas
  apartment: '1040',   // Departamentos
  land: '1060',        // Terrenos y Parcelas
  commercial: '1080',  // Locales Comerciales / Oficinas
  office: '1080',
  industrial: '1080',
};

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('status', 'active');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<yapo_feed version="1.0">\n`;
    xml += `  <account>\n`;
    xml += `    <userid>13722681</userid>\n`;
    xml += `    <email>merinopropiedades@gmail.com</email>\n`;
    xml += `    <slug>merino-propiedades</slug>\n`;
    xml += `  </account>\n`;
    xml += `  <adverts>\n`;

    (properties || []).forEach((prop: any) => {
      const categoryId = YAPO_CATEGORY_MAP[prop.property_type] || '1020';
      const offerType = prop.price_type === 'sale' ? 's' : 'r';
      const currency = prop.price_type === 'sale' ? 'UF' : 'CLP';
      const code = prop.code || `COD-${prop.id.slice(0, 6)}`;
      const propUrl = `${siteUrl}/propiedades/${prop.slug}`;

      xml += `    <ad>\n`;
      xml += `      <id>${escapeXml(code)}</id>\n`;
      xml += `      <external_id>${escapeXml(prop.id)}</external_id>\n`;
      xml += `      <title>${escapeXml(prop.title)}</title>\n`;
      xml += `      <category>${categoryId}</category>\n`;
      xml += `      <type>${offerType}</type>\n`;
      xml += `      <price>${prop.price || 0}</price>\n`;
      xml += `      <currency>${currency}</currency>\n`;
      xml += `      <description>${escapeXml(prop.description + '\n\nVer en Activos en Red: ' + propUrl)}</description>\n`;
      xml += `      <commune>${escapeXml(prop.city || 'La Serena')}</commune>\n`;
      xml += `      <region>${escapeXml(prop.region || 'Coquimbo')}</region>\n`;
      xml += `      <address>${escapeXml(prop.address || '')}</address>\n`;
      if (prop.bedrooms) xml += `      <bedrooms>${prop.bedrooms}</bedrooms>\n`;
      if (prop.bathrooms) xml += `      <bathrooms>${prop.bathrooms}</bathrooms>\n`;
      if (prop.area) xml += `      <size_m2>${prop.area}</size_m2>\n`;
      xml += `      <url>${escapeXml(propUrl)}</url>\n`;

      if (prop.images && prop.images.length > 0) {
        xml += `      <images>\n`;
        prop.images.slice(0, 20).forEach((imgUrl: string) => {
          const fullImg = imgUrl.startsWith('http') ? imgUrl : `${siteUrl}${imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl}`;
          xml += `        <image>${escapeXml(fullImg)}</image>\n`;
        });
        xml += `      </images>\n`;
      }
      xml += `    </ad>\n`;
    });

    xml += `  </adverts>\n`;
    xml += `</yapo_feed>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
