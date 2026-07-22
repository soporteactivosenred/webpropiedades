import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DEFAULT_SETTINGS } from '@/types';

// Create a singleton of Resend only if the API key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, message, source = 'website' } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (!resend) {
      console.warn('RESEND_API_KEY no está configurada. Saltando envío de email.');
      return NextResponse.json({ success: true, warning: 'No API key configured' });
    }

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || DEFAULT_SETTINGS.site_name;
    const fromAddress = process.env.EMAIL_FROM || `${siteName} <onboarding@resend.dev>`;
    const adminRecipient = process.env.NOTIFICATION_EMAIL || DEFAULT_SETTINGS.contact_email;

    let adminSubject = `[Nuevo Lead] Consulta de ${name}`;
    if (source === 'whatsapp') {
      adminSubject = `[Nuevo Lead WhatsApp] ${name}`;
    } else if (source === 'vender_propiedad') {
      adminSubject = `[Solicitud de Captación/Venta] ${name}`;
    }

    // 1. Email para el Administrador / Corredora
    const adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">${siteName}</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Nueva consulta de cliente recibida</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; margin-top: 0;"><strong>Origen del Formulario:</strong> ${
            source === 'vender_propiedad' ? 'Solicitud Vender/Arrendar Propiedad' : source === 'whatsapp' ? 'Botón de WhatsApp' : 'Formulario de Contacto Web'
          }</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="margin: 8px 0;"><strong>Nombre completo:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
          <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
          <p style="margin: 16px 0 8px 0;"><strong>Mensaje / Detalles de la solicitud:</strong></p>
          <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #2563eb; border-radius: 4px; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message}</div>
        </div>
        <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 12px; color: #64748b;">
          Puedes responder directamente a este correo para comunicarte con ${name}.
        </div>
      </div>
    `;

    // 1. Email para el Administrador / Corredora
    let adminEmailData = null;
    let adminError = null;
    try {
      const adminRes = await resend.emails.send({
        from: fromAddress,
        to: [adminRecipient],
        subject: adminSubject,
        html: adminHtmlContent,
        reply_to: email,
      });
      adminEmailData = adminRes.data;
      adminError = adminRes.error;
    } catch (err: any) {
      console.error('Error enviando email a administración:', err);
    }

    // 2. Email de Bienvenida / Confirmación para el Cliente (Lead)
    // Nota: Solo funcionará si se verifica un dominio propio en Resend o si el destinatario es el correo registrado en Resend
    let leadEmailData = null;
    let leadError = null;
    try {
      const leadSubject = `¡Gracias por contactar a ${siteName}! Hemos recibido tu mensaje`;
      const leadHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">${siteName}</h1>
            <p style="color: #38bdf8; margin: 6px 0 0 0; font-size: 14px;">Confirmación de Solicitud</p>
          </div>
          <div style="padding: 24px; line-height: 1.6;">
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">¡Hola ${name}! 👋</h2>
            <p>Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje correctamente y nuestro equipo ya está revisando tu requerimiento.</p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #166534; font-weight: bold; font-size: 14px;">✓ Un ejecutivo inmobiliario te contactará a la brevedad.</p>
            </div>

            <p style="font-size: 14px; color: #475569; margin-bottom: 8px;"><strong>Resumen de tu mensaje enviado:</strong></p>
            <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; font-size: 13px; color: #334155; border: 1px solid #e2e8f0; white-space: pre-wrap;">${message}</div>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

            <p style="margin-bottom: 4px; font-size: 14px;">¿Necesitas atención urgente?</p>
            <p style="margin-top: 0; font-size: 14px; color: #475569;">
              Puedes llamarnos directamente o escribirnos por WhatsApp:
            </p>
            <div style="margin-top: 12px;">
              ${DEFAULT_SETTINGS.contact_whatsapp ? `
                <a href="https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp.replace(/\D/g, '')}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: bold; margin-right: 10px;">
                  Chat por WhatsApp
                </a>
              ` : ''}
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
            ${siteName} — ${DEFAULT_SETTINGS.contact_address || 'Chile'}
          </div>
        </div>
      `;

      const leadRes = await resend.emails.send({
        from: fromAddress,
        to: [email],
        subject: leadSubject,
        html: leadHtmlContent,
      });
      leadEmailData = leadRes.data;
      leadError = leadRes.error;
    } catch (err: any) {
      console.warn('Copia al lead no enviada (Requiere verificación de dominio en Resend):', err.message);
    }

    return NextResponse.json({
      success: true,
      adminEmail: adminEmailData,
      leadEmail: leadEmailData,
    });
  } catch (error: any) {
    console.error('Error procesando request de contacto:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

