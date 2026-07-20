'use client';

import { useState, useEffect } from 'react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import type { Database } from '@/types';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

interface SettingsFormData {
  site_name: string;
  site_description: string;
  whatsapp_number: string;
  whatsapp_avatar: string;
  contact_email: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  seo_default_title: string;
  seo_default_description: string;
  seo_default_keywords: string;
  og_image: string;
  meta_fb_page_id: string;
  meta_ig_business_id: string;
  meta_page_access_token: string;
}

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<SettingsFormData>({
    site_name: 'Activos en Red',
    site_description: '',
    whatsapp_number: '',
    whatsapp_avatar: '',
    contact_email: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    twitter_url: '',
    seo_default_title: '',
    seo_default_description: '',
    seo_default_keywords: '',
    og_image: '',
    meta_fb_page_id: '',
    meta_ig_business_id: '',
    meta_page_access_token: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado para el test de conexión Meta
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    token: { ok: boolean; message: string; detail: string };
    facebook: { ok: boolean; message: string; detail: string };
    instagram: { ok: boolean; message: string; detail: string };
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*');

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      // Map settings to form data
      const settingsMap: Record<string, string> = {};
      data?.forEach((setting: any) => {
        settingsMap[setting.key] = String(setting.value);
      });

      setSettings({
        site_name: settingsMap.site_name || 'Activos en Red',
        site_description: settingsMap.site_description || '',
        whatsapp_number: settingsMap.whatsapp_number || '',
        whatsapp_avatar: settingsMap.whatsapp_avatar || '/ejecutiva.png',
        contact_email: settingsMap.contact_email || '',
        facebook_url: settingsMap.facebook_url || '',
        instagram_url: settingsMap.instagram_url || '',
        linkedin_url: settingsMap.linkedin_url || '',
        twitter_url: settingsMap.twitter_url || '',
        seo_default_title: settingsMap.seo_default_title || '',
        seo_default_description: settingsMap.seo_default_description || '',
        seo_default_keywords: settingsMap.seo_default_keywords || '',
        og_image: settingsMap.og_image || '',
        meta_fb_page_id: settingsMap.meta_fb_page_id || '',
        meta_ig_business_id: settingsMap.meta_ig_business_id || '',
        meta_page_access_token: settingsMap.meta_page_access_token || '',
      });
    } catch (err) {
      setError('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createAdminBrowserClient() as any;

      // Update each setting individually
      const settingsToUpdate = [
        { key: 'site_name', value: settings.site_name },
        { key: 'site_description', value: settings.site_description },
        { key: 'whatsapp_number', value: settings.whatsapp_number },
        { key: 'whatsapp_avatar', value: settings.whatsapp_avatar },
        { key: 'contact_email', value: settings.contact_email },
        { key: 'facebook_url', value: settings.facebook_url },
        { key: 'instagram_url', value: settings.instagram_url },
        { key: 'linkedin_url', value: settings.linkedin_url },
        { key: 'twitter_url', value: settings.twitter_url },
        { key: 'seo_default_title', value: settings.seo_default_title },
        { key: 'seo_default_description', value: settings.seo_default_description },
        { key: 'seo_default_keywords', value: settings.seo_default_keywords },
        { key: 'og_image', value: settings.og_image },
        { key: 'meta_fb_page_id', value: settings.meta_fb_page_id },
        { key: 'meta_ig_business_id', value: settings.meta_ig_business_id },
        { key: 'meta_page_access_token', value: settings.meta_page_access_token },
      ];

      for (const setting of settingsToUpdate) {
        // Try to update, if not exists insert
        const { error: updateError } = await supabase
          .from('site_settings')
          .upsert(
            { key: setting.key, value: setting.value },
            { onConflict: 'key' }
          );

        if (updateError) {
          console.error(`Error updating ${setting.key}:`, updateError);
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleTestMeta = async () => {
    setTesting(true);
    setTestResults(null);
    try {
      const res = await fetch('/api/admin/test-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta_fb_page_id: settings.meta_fb_page_id,
          meta_ig_business_id: settings.meta_ig_business_id,
          meta_page_access_token: settings.meta_page_access_token,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setTestResults(data.results);
      } else {
        setTestResults(null);
      }
    } catch {
      setTestResults(null);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Configura los ajustes generales del sitio</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="text-sm">Configuración guardada correctamente</p>
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nombre del Sitio"
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                placeholder="Activos en Red"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Descripción del Sitio"
                name="site_description"
                value={settings.site_description}
                onChange={handleChange}
                placeholder="Breve descripción de tu empresa"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="WhatsApp"
              name="whatsapp_number"
              value={settings.whatsapp_number}
              onChange={handleChange}
              placeholder="+56912345678"
              hint="Número con código de país, sin espacios ni guiones"
            />

            <Input
              label="Avatar WhatsApp (URL)"
              name="whatsapp_avatar"
              value={settings.whatsapp_avatar}
              onChange={handleChange}
              placeholder="https://ejemplo.com/ejecutiva.png"
              hint="URL de la imagen o ruta local (ej. /ejecutiva.png)"
            />

            <Input
              label="Email de Contacto"
              name="contact_email"
              type="email"
              value={settings.contact_email}
              onChange={handleChange}
              placeholder="contacto@ejemplo.com"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Facebook"
              name="facebook_url"
              type="url"
              value={settings.facebook_url}
              onChange={handleChange}
              placeholder="https://facebook.com/tupagina"
            />

            <Input
              label="Instagram"
              name="instagram_url"
              type="url"
              value={settings.instagram_url}
              onChange={handleChange}
              placeholder="https://instagram.com/tuusuario"
            />

            <Input
              label="LinkedIn"
              name="linkedin_url"
              type="url"
              value={settings.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/tuusuario"
            />

            <Input
              label="Twitter/X"
              name="twitter_url"
              type="url"
              value={settings.twitter_url}
              onChange={handleChange}
              placeholder="https://twitter.com/tuusuario"
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Global</h2>
          <p className="text-sm text-gray-500 mb-4">
            Estos valores se usarán como predeterminados cuando las páginas no tengan SEO personalizado.
          </p>
          
          <div className="space-y-4">
            <Input
              label="Título Predeterminado"
              name="seo_default_title"
              value={settings.seo_default_title}
              onChange={handleChange}
              placeholder="Título para páginas sin SEO específico"
              hint="Máximo 60 caracteres"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Predeterminada
              </label>
              <textarea
                name="seo_default_description"
                value={settings.seo_default_description}
                onChange={handleChange}
                placeholder="Descripción predeterminada para SEO"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                rows={3}
              />
              <p className="mt-1.5 text-sm text-gray-500">Máximo 160 caracteres</p>
            </div>

            <Input
              label="Palabras Clave Predeterminadas"
              name="seo_default_keywords"
              value={settings.seo_default_keywords}
              onChange={handleChange}
              placeholder="inmuebles, propiedades, arriendo, venta"
              hint="Separadas por comas"
            />

            <Input
              label="URL de Imagen OG"
              name="og_image"
              type="url"
              value={settings.og_image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen-og.jpg"
              hint="Imagen para Open Graph (1200x630px recomendado)"
            />
          </div>
        </div>

        {/* Meta Integration Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Integración de Redes Sociales (Meta Graph API)</h2>
          <p className="text-sm text-gray-500 mb-6">
            Configura las credenciales de tu aplicación de Meta para permitir la autopublicación automática de los artículos de blog en tu Página de Facebook y tu cuenta de Instagram Business.
          </p>
          
          <div className="space-y-4">
            <Input
              label="ID de la Página de Facebook"
              name="meta_fb_page_id"
              value={settings.meta_fb_page_id}
              onChange={handleChange}
              placeholder="Ej: 102938475610293"
              hint={
                <span>
                  ID numérico de tu página comercial de Facebook. Puedes ver tus páginas en la{' '}
                  <a href="https://www.facebook.com/pages" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-semibold">
                    sección de Páginas de Facebook
                  </a>.
                </span>
              }
            />

            <Input
              label="ID de la Cuenta de Instagram Business"
              name="meta_ig_business_id"
              value={settings.meta_ig_business_id}
              onChange={handleChange}
              placeholder="Ej: 17841401234567890"
              hint={
                <span>
                  ID comercial de tu cuenta de Instagram vinculada. Puedes encontrarlo en la{' '}
                  <a href="https://business.facebook.com/settings/instagram-profiles" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-semibold">
                    Configuración de Cuentas de Instagram en Business Manager
                  </a>.
                </span>
              }
            />

            <Input
              label="Token de Acceso de Meta (System User / Page Token)"
              name="meta_page_access_token"
              value={settings.meta_page_access_token}
              onChange={handleChange}
              placeholder="Escribe el token de Meta (empieza con EAAB...)"
              hint={
                <span>
                  Token de acceso de larga duración. Genera tu token en el{' '}
                  <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-semibold">
                    Explorador de Graph API
                  </a> y extiéndelo desde la{' '}
                  <a href="https://developers.facebook.com/tools/accesstoken" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-semibold">
                    Herramienta de Tokens de Acceso
                  </a> para evitar que expire.
                </span>
              }
            />
          </div>

          {/* Botón Probar Conexión */}
          <div className="pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={handleTestMeta}
              disabled={testing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{
                background: testing ? '#e5e7eb' : 'linear-gradient(135deg, #1877f2 0%, #e1306c 100%)',
                color: testing ? '#9ca3af' : '#ffffff',
                cursor: testing ? 'not-allowed' : 'pointer',
                boxShadow: testing ? 'none' : '0 2px 8px 0 rgba(24,119,242,0.25)',
              }}
            >
              {testing ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Probando conexión...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Probar Conexión con Meta
                </>
              )}
            </button>

            {/* Resultados del test */}
            {testResults && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {(
                  [
                    { key: 'token', label: 'Token de Acceso', icon: '🔑' },
                    { key: 'facebook', label: 'Página de Facebook', icon: '🔵' },
                    { key: 'instagram', label: 'Instagram Business', icon: '📸' },
                  ] as { key: 'token' | 'facebook' | 'instagram'; label: string; icon: string }[]
                ).map(({ key, label, icon }) => {
                  const r = testResults[key];
                  return (
                    <div
                      key={key}
                      className={`rounded-xl p-4 border-2 flex flex-col gap-1 transition-all duration-200 ${
                        r.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                        <span
                          className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                            r.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {r.ok ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          {r.ok ? 'OK' : 'Error'}
                        </span>
                      </div>
                      <p className={`text-sm font-semibold ${r.ok ? 'text-green-800' : 'text-red-800'}`}>{r.message}</p>
                      <p className={`text-xs ${r.ok ? 'text-green-600' : 'text-red-500'}`}>{r.detail}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  );
}