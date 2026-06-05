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
      // Return 200 so the frontend doesn't break, just logs warning
      return NextResponse.json({ success: true, warning: 'No API key configured' });
    }

    let subject = `Nuevo mensaje de contacto de ${name}`;
    if (source === 'whatsapp') {
      subject = `Nuevo lead desde botón de WhatsApp: ${name}`;
    }

    const htmlContent = `
      <h2>Nuevo Contacto / Lead</h2>
      <p><strong>Origen:</strong> ${source === 'whatsapp' ? 'Botón de WhatsApp' : 'Formulario Web'}</p>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
      <p><strong>Mensaje / Servicio Buscado:</strong></p>
      <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0056b3;">
        ${message}
      </blockquote>
    `;

    // Note: To use resend for production, you need a verified domain.
    // By default, resend allows sending to the email registered in your Resend account from 'onboarding@resend.dev'
    const { data: emailData, error } = await resend.emails.send({
      from: 'Activos en Red <onboarding@resend.dev>',
      to: [process.env.NOTIFICATION_EMAIL || DEFAULT_SETTINGS.contact_email],
      subject: subject,
      html: htmlContent,
      reply_to: email, // Permite responder directo al cliente
    });

    if (error) {
      console.error('Error enviando email con Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: emailData });
  } catch (error) {
    console.error('Error procesando request de contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
