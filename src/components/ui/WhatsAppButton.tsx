'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, MessageCircle, User, Phone, Mail, Home, Loader2, CheckCircle2 } from 'lucide-react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { DEFAULT_SETTINGS } from '@/types';

const SERVICES = [
  'Comprar una propiedad',
  'Arrendar una propiedad',
  'Vender mi propiedad',
  'Tasación de propiedad',
  'Asesoría general',
];

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_SETTINGS.whatsapp_avatar);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_SETTINGS.contact_whatsapp.replace(/[^0-9]/g, ''));
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createAdminBrowserClient() as any;
        const { data } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['whatsapp_avatar', 'contact_whatsapp']);

        if (data) {
          const avatar = data.find((s: any) => s.key === 'whatsapp_avatar');
          if (avatar && avatar.value) setAvatarUrl(avatar.value);

          const phone = data.find((s: any) => s.key === 'contact_whatsapp');
          if (phone && phone.value) setWhatsappNumber(phone.value.replace(/[^0-9]/g, ''));
        }
      } catch (err) {
        console.error('Error fetching dynamic WhatsApp settings:', err);
      }
    };

    fetchSettings();

    // Listen for custom event to open the modal from other buttons
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-whatsapp-modal', handleOpenModal);

    return () => {
      window.removeEventListener('open-whatsapp-modal', handleOpenModal);
    };
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }
    if (!formData.service) newErrors.service = 'Selecciona un servicio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Guardar lead en Supabase
      const supabase = createAdminBrowserClient() as any;
      await supabase.from('leads').insert([{
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: `Servicio: ${formData.service}`,
        source: 'whatsapp',
        status: 'new',
      }]);

      // Enviar email vía Resend (opcional, no bloqueante)
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.service,
          source: 'whatsapp'
        }),
      }).catch(err => console.error('Error enviando email:', err));

      setStep('success');

      // Redirigir a WhatsApp después de 1.5 segundos
      setTimeout(() => {
        const message = encodeURIComponent(
          `Hola! Soy *${formData.name}* y estoy interesado/a en: *${formData.service}*. Mi teléfono es: ${formData.phone}`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error al guardar lead:', err);
      // Si falla Supabase, igual redirigimos a WhatsApp
      const message = encodeURIComponent(
        `Hola! Soy *${formData.name}* y estoy interesado/a en: *${formData.service}*. Mi teléfono es: ${formData.phone}`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('form');
      setFormData({ name: '', phone: '', email: '', service: '' });
      setErrors({});
    }, 300);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex flex-col items-center gap-1"
        aria-label="Contactar por WhatsApp"
      >
        {/* Tooltip */}
        <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          ¿Necesitas ayuda?
        </span>

        {/* Avatar Circle */}
        <div className="relative">
          {/* Pulse animation rings */}
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
          <span className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-20" />

          {/* Main circle with executive photo */}
          <div className="relative w-16 h-16 rounded-full border-4 border-green-500 shadow-2xl overflow-hidden bg-gray-200 hover:scale-110 transition-transform duration-300">
            <Image
              src={avatarUrl}
              alt="Ejecutiva Activos en Red"
              fill
              className="object-cover object-center scale-110"
            />
          </div>

          {/* WhatsApp badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        </div>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-3 border-white shadow-lg overflow-hidden bg-gray-200 flex-shrink-0" style={{borderWidth: '3px'}}>
                  <Image
                    src={avatarUrl}
                    alt="Ejecutiva"
                    width={56}
                    height={56}
                    className="object-cover object-[center_10%] scale-125 w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-tight">Activos en Red</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    <p className="text-green-100 text-sm">En línea · Responde rápido</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="ml-auto text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 'success' ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">¡Todo listo!</h3>
                  <p className="text-gray-500 text-sm">Abriendo WhatsApp en un momento...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-5">
                    Cuéntanos brevemente qué necesitas y te ayudamos de inmediato por WhatsApp 🏡
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nombre completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej: María González"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                            errors.name
                              ? 'border-red-300 focus:ring-red-200'
                              : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                          }`}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+56 9 73081220"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                            errors.phone
                              ? 'border-red-300 focus:ring-red-200'
                              : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Correo electrónico *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Ej: maria@ejemplo.com"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                            errors.email
                              ? 'border-red-300 focus:ring-red-200'
                              : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Servicio */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        ¿Qué servicio buscas? *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors bg-white appearance-none ${
                            errors.service
                              ? 'border-red-300 focus:ring-red-200'
                              : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                          }`}
                        >
                          <option value="">Selecciona una opción</option>
                          {SERVICES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-green-200"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <MessageCircle className="w-5 h-5 fill-white" />
                      )}
                      {isLoading ? 'Enviando...' : 'Continuar en WhatsApp'}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      Tu información es confidencial y nunca será compartida.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
