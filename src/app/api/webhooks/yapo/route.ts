import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[Yapo Webhook Received]:', JSON.stringify(body, null, 2));

    const contactName = body.contact?.name || body.name || 'Interesado Yapo';
    const contactEmail = body.contact?.email || body.email || 'sin-email@yapo.cl';
    const contactPhone = body.contact?.phone || body.phone || null;
    const message = body.message || `Consulta desde Yapo.cl sobre: ${body.title || body.addetails?.title || 'Propiedad'}`;
    const propertyId = body.sourceid || null;
    const adTitle = body.title || body.addetails?.title || '';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let matchedPropertyId = null;

    // Si viene el sourceid (que es el ID de la propiedad en Activos en Red)
    if (propertyId) {
      const { data: prop } = await supabaseAdmin
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .maybeSingle();

      if (prop) {
        matchedPropertyId = prop.id;
      }
    }

    // Insertar en la tabla leads
    const { data: newLead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .insert({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        message: `${message}\n\n[Origen: Yapo.cl | Ad ID: ${body.adid || 'N/A'}${adTitle ? ` | Anuncio: ${adTitle}` : ''}]`,
        property_id: matchedPropertyId,
        source: 'social', // o 'website'
        status: 'new',
      })
      .select()
      .single();

    if (leadErr) {
      console.error('[Yapo Webhook Insert Error]:', leadErr);
      return NextResponse.json({ error: leadErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead de Yapo.cl registrado exitosamente en Activos en Red',
      leadId: newLead?.id,
    }, { status: 200 });

  } catch (err: any) {
    console.error('[Yapo Webhook Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Permitir verificación GET de conectividad por parte de Yapo o testers
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Activos en Red - Yapo.cl Webhook Receiver',
    timestamp: new Date().toISOString(),
  });
}
