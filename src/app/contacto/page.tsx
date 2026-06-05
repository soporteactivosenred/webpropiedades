'use client';

import { useState } from 'react';
import { Button, Input, TextArea } from '@/components/ui';
import { validateForm, contactFormSchema } from '@/lib';
import { Send, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';
import { createClientComponentClient } from '@/lib/supabase/client';

export default function ContactPage() {
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

    const supabase = createClientComponentClient() as any;
    
    const { error } = await supabase.from('leads').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      source: 'contact_form',
      status: 'new'
    });

    if (error) {
      console.error('Error saving lead:', error);
      setErrors({ form: 'Hubo un error al enviar tu mensaje. Intenta nuevamente.' });
      setIsSubmitting(false);
      return;
    }

    // Send email notification via Resend
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          source: 'website'
        }),
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No bloqueamos el flujo de éxito si el email falla
    }

    setSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-primary-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Contáctanos
          </h1>
          <p className="mt-2 text-primary-100 text-lg">
            Estamos aquí para ayudarte a encontrar tu próxima propiedad
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Envíanos un mensaje
            </h2>

            {success ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  ¡Mensaje enviado!
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Gracias por contactarnos. Te responderemos a la brevedad.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSuccess(false)}
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
                  label="Teléfono"
                  placeholder="+56 9 1234 5678"
                  error={errors.phone}
                />
                <TextArea
                  name="message"
                  label="Mensaje"
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                  required
                  error={errors.message}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-5 h-5" />}
                >
                  Enviar mensaje
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Información de contacto
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Dirección</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {DEFAULT_SETTINGS.contact_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Teléfono</h3>
                  <a href={`tel:${DEFAULT_SETTINGS.contact_phone}`} className="mt-1 text-gray-600 dark:text-gray-400 hover:text-primary-600">
                    {DEFAULT_SETTINGS.contact_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                  <a href={`mailto:${DEFAULT_SETTINGS.contact_email}`} className="mt-1 text-gray-600 dark:text-gray-400 hover:text-primary-600">
                    {DEFAULT_SETTINGS.contact_email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Horario de atención</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Lunes a Viernes: 9:00 - 18:00<br />
                    Sábados: 10:00 - 14:00
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ¿Prefieres WhatsApp?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Escríbenos directamente y te responderemos al instante.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-whatsapp-modal'))}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribir por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}