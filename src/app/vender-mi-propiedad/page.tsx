'use client';

import { useState } from 'react';
import { Button, Input, Select, TextArea } from '@/components/ui';
import { Home, Building2, LandPlot, Warehouse, Building, Check, Phone, Mail } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase/client';

const propertyTypes = [
  { value: 'house', label: 'Casa', icon: Home },
  { value: 'apartment', label: 'Departamento', icon: Building2 },
  { value: 'land', label: 'Terreno', icon: LandPlot },
  { value: 'commercial', label: 'Local comercial', icon: Warehouse },
  { value: 'office', label: 'Oficina', icon: Building },
];

export default function SellPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const propertyType = formData.get('property_type') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const region = formData.get('region') as string;
    const price = formData.get('price') as string;
    const priceType = formData.get('price_type') as string;
    const description = formData.get('message') as string;

    const formattedMessage = [
      `SOLICITUD DE CAPTACIÓN / VENTA DE PROPIEDAD`,
      `• Tipo de Inmueble: ${propertyType}`,
      `• Dirección: ${address}, ${city}, ${region}`,
      `• Operación: ${priceType === 'sale' ? 'Venta' : 'Arriendo'}`,
      `• Precio Esperado: $${Number(price || 0).toLocaleString('es-CL')} CLP`,
      description ? `\nDescripción adicional: ${description}` : '',
    ].filter(Boolean).join('\n');

    try {
      const supabase = createClientComponentClient() as any;
      
      await supabase.from('leads').insert({
        name,
        email,
        phone: phone || null,
        message: formattedMessage,
        source: 'website',
        status: 'new',
      });

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: formattedMessage,
          source: 'vender_propiedad',
        }),
      });

      setSuccess(true);
    } catch (err: any) {
      console.error('Error enviando formulario de captación:', err);
      setErrorMessage('Hubo un problema al enviar la solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Solicitud enviada!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Gracias por confiar en nosotros. Un agente se pondrá en contacto contigo en las próximas 24 horas para evaluar tu propiedad.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Vende o arrenda tu propiedad
          </h1>
          <p className="mt-2 text-primary-100 text-lg">
            Te ayudamos a encontrar al comprador o arrendatario ideal
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Por qué vender con nosotros?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Evaluación gratuita</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Fotos profesionales</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Alta en portales</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>1</span>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>2</span>
          </div>

          <form onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {errorMessage}
              </div>
            )}
            {step === 1 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Datos de contacto
                </h3>
                <div className="space-y-4">
                  <Input
                    name="name"
                    label="Nombre completo"
                    placeholder="Tu nombre"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="tu@email.com"
                      required
                    />
                    <Input
                      name="phone"
                      type="tel"
                      label="Teléfono"
                      placeholder="+56 9 1234 5678"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={() => setStep(2)}>
                    Siguiente
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Datos de la propiedad
                </h3>
                <div className="space-y-4">
                  <Select
                    name="property_type"
                    label="Tipo de propiedad"
                    options={[
                      { value: '', label: 'Selecciona el tipo' },
                      ...propertyTypes.map(t => ({ value: t.value, label: t.label }))
                    ]}
                    required
                  />
                  <Input
                    name="address"
                    label="Dirección"
                    placeholder="Ej: Av. del Mar 1000, La Serena"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="city"
                      label="Ciudad"
                      placeholder="La Serena"
                      required
                    />
                    <Input
                      name="region"
                      label="Región"
                      placeholder="Coquimbo"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="price"
                      type="number"
                      label="Precio esperado (CLP)"
                      placeholder="150000000"
                      required
                    />
                    <Select
                      name="price_type"
                      label="Tipo de oferta"
                      options={[
                        { value: 'sale', label: 'Venta' },
                        { value: 'rent', label: 'Arriendo' },
                      ]}
                      required
                    />
                  </div>
                  <TextArea
                    name="message"
                    label="Descripción de la propiedad (opcional)"
                    placeholder="Cuéntanos más sobre tu propiedad..."
                    rows={4}
                  />
                </div>
                <div className="mt-6 flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Volver
                  </Button>
                  <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                    Enviar solicitud
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Prefieres hablar directamente?{' '}
            <a href="tel:+56912345678" className="text-primary-600 font-medium hover:underline">
              Llámanos al +56 9 1234 5678
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}