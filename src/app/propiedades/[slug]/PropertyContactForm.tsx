'use client';

import { useState } from 'react';
import { Button, Input, TextArea } from '@/components/ui';
import { validateForm, contactFormSchema } from '@/lib';
import { Mail, Send } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase/client';

interface Props {
  propertyId: string;
  propertyTitle: string;
  propertySlug?: string;
  propertyCode?: string;
}

export function PropertyContactForm({ propertyId, propertyTitle, propertySlug, propertyCode }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    const validation = validateForm(contactFormSchema, data);
    if (!validation.success) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    const origin = typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.activosenred.cl');
    const propertyUrl = propertySlug ? `${origin}/propiedades/${propertySlug}` : undefined;

    const supabase = createClientComponentClient() as any;
    
    const { error } = await supabase.from('leads').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: `Consulta sobre Propiedad: "${propertyTitle}"\nCódigo: ${propertyCode || 'N/A'}\nEnlace: ${propertyUrl || 'N/A'}\n\nMensaje:\n${data.message}`,
      source: 'website',
      status: 'new'
    });

    if (error) {
      console.error('Error saving lead:', error);
      setErrors({ form: 'Hubo un error al enviar tu mensaje. Intenta nuevamente.' });
      setIsSubmitting(false);
      return;
    }

    // Send email via Resend API with property code & URL
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          propertyTitle,
          propertyCode,
          propertyUrl,
          source: 'property_inquiry',
        }),
      });
    } catch (emailErr) {
      console.error('Error enviando email:', emailErr);
    }

    setSuccess(true);
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white">¡Mensaje enviado!</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Nos pondremos en contacto contigo pronto sobre &quot;{propertyTitle}&quot;.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.form}
        </div>
      )}
      <Input
        name="name"
        label="Nombre completo"
        placeholder="Tu nombre"
        required
        error={errors.name}
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="tu@email.com"
        required
        error={errors.email}
      />
      <Input
        name="phone"
        type="tel"
        label="Teléfono (opcional)"
        placeholder="+56 9 73081220"
        error={errors.phone}
      />
      <TextArea
        name="message"
        label="Mensaje"
        placeholder={`Estoy interesado/a en "${propertyTitle}". Me gustaría obtener más información.`}
        rows={4}
        error={errors.message}
      />
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        leftIcon={<Send className="w-4 h-4" />}
      >
        Enviar mensaje
      </Button>
    </form>
  );
}