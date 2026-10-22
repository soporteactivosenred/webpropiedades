import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRegionId } from '@/lib/yapo-locations';

// Mapeo oficial de categorías Encuentra24 / Yapo Chile
// 173: Casas en Venta
// 179: Apartamentos en Venta
// 175: Lotes y Terrenos
// 176: Locales Comerciales / Oficinas
const YAPO_CATEGORY_MAP: Record<string, string> = {
  house: '173',
  apartment: '179',
  land: '175',
  commercial: '176',
  office: '176',
  industrial: '176',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get('download') === '1';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .eq('publish_to_yapo', true);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<import>\n`;
    xml += `  <settings>\n`;
    xml += `    <type><![CDATA[property]]></type>\n`;
    xml += `    <language><![CDATA[es]]></language>\n`;
    xml += `  </settings>\n`;
    xml += `  <items>\n`;

    (properties || []).forEach((prop: any) => {
      const categoryId = YAPO_CATEGORY_MAP[prop.property_type] || '173';
      const regionId = getRegionId(prop.city, prop.region);

      // Moneda oficial según manual demo: CLF para UF, CLP para Pesos
      const currency = prop.price_type === 'sale' ? 'CLF' : 'CLP';
      const cleanPrice = Math.round(Number(prop.price) || 0);
      const bedrooms = prop.bedrooms || 1;
      const bathrooms = prop.bathrooms || 1;
      const area = Math.round(Number(prop.area || prop.terrain_area) || 1);
      const parking = prop.parking_spots !== undefined && prop.parking_spots !== null ? prop.parking_spots : 0;
      const propUrl = `${siteUrl}/propiedades/${prop.slug}`;
      const fullDescription = `${prop.description || ''}\n\nVer ficha completa en Activos en Red: ${propUrl}`;

      const cleanTitle = (prop.title || 'Propiedad en Venta').trim().slice(0, 70);

      xml += `    <item>\n`;
      xml += `      <required>\n`;
      xml += `        <ad>\n`;
      xml += `          <sourceid><![CDATA[${prop.id}]]></sourceid>\n`;
      xml += `          <countryid>5247</countryid>\n`;
      xml += `          <categoryid>${categoryId}</categoryid>\n`;
      xml += `          <regionid>${regionId}</regionid>\n`;
      xml += `          <type><![CDATA[property]]></type>\n`;
      xml += `          <title><![CDATA[${cleanTitle}]]></title>\n`;
      xml += `          <currency><![CDATA[${currency}]]></currency>\n`;
      xml += `          <price>${cleanPrice}</price>\n`;
      xml += `          <rooms>${bedrooms}</rooms>\n`;
      xml += `          <bath>${bathrooms}</bath>\n`;
      xml += `          <square>${area}</square>\n`;
      xml += `          <parking>${parking}</parking>\n`;
      xml += `          <advertiser><![CDATA[Propietario]]></advertiser>\n`;
      xml += `        </ad>\n`;
      xml += `        <contact>\n`;
      xml += `          <contact><![CDATA[ACTIVOS EN RED]]></contact>\n`;
      xml += `          <email><![CDATA[merinopropiedades@gmail.com]]></email>\n`;
      xml += `          <phone><![CDATA[0056 973081220]]></phone>\n`;
      xml += `          <city><![CDATA[${prop.city || 'La Serena'}]]></city>\n`;
      xml += `        </contact>\n`;
      xml += `      </required>\n`;
      xml += `      <optional>\n`;
      xml += `        <ad>\n`;
      xml += `          <title1/>\n`;
      xml += `          <exact/>\n`;
      xml += `          <descr><![CDATA[${fullDescription}]]></descr>\n`;
      xml += `          <descr1/>\n`;
      xml += `          <maintenance/>\n`;
      xml += `          <lotsize>${prop.terrain_area ? Math.round(prop.terrain_area) : 0}</lotsize>\n`;
      xml += `          <room_height/>\n`;
      xml += `          <age/>\n`;
      xml += `          <floortype/>\n`;
      xml += `          <stories/>\n`;
      xml += `          <floor/>\n`;
      xml += `          <swimmingpool/>\n`;
      xml += `          <balcon/>\n`;
      xml += `          <benefits/>\n`;
      xml += `          <appliances/>\n`;
      xml += `          <building/>\n`;
      xml += `          <hidemapmarker/>\n`;
      xml += `          <furnished/>\n`;
      xml += `          <petfriendly/>\n`;

      // Fotos optimizadas Cloudflare R2
      if (prop.images && prop.images.length > 0) {
        prop.images.slice(0, 25).forEach((imgUrl: string) => {
          const fullImg = imgUrl.startsWith('http') ? imgUrl : `${siteUrl}${imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl}`;
          xml += `          <picture><![CDATA[${fullImg}]]></picture>\n`;
        });
      }

      xml += `        </ad>\n`;
      xml += `        <contact>\n`;
      xml += `          <company><![CDATA[Activos en Red]]></company>\n`;
      xml += `          <licence><![CDATA[Activos en Red]]></licence>\n`;
      xml += `          <phone2><![CDATA[0056 973081220]]></phone2>\n`;
      xml += `          <addr><![CDATA[${prop.address || 'Gomez Carreño 333, La Serena'}]]></addr>\n`;
      xml += `          <url><![CDATA[${propUrl}]]></url>\n`;
      xml += `          <skype/>\n`;
      xml += `        </contact>\n`;
      xml += `        <safeshopping/>\n`;
      xml += `      </optional>\n`;
      xml += `    </item>\n`;
    });

    xml += `  </items>\n`;
    xml += `</import>`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    };

    if (isDownload) {
      headers['Content-Disposition'] = 'attachment; filename="feed.xml"';
    }

    return new NextResponse(xml, { headers });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
