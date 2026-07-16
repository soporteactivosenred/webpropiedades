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
              hint="ID numérico de tu página comercial de Facebook."
            />

            <Input
              label="ID de la Cuenta de Instagram Business"
              name="meta_ig_business_id"
              value={settings.meta_ig_business_id}
              onChange={handleChange}
              placeholder="Ej: 17841401234567890"
              hint="ID comercial de tu cuenta de Instagram vinculada a tu página de Facebook."
            />

            <Input
              label="Token de Acceso de Meta (System User / Page Token)"
              name="meta_page_access_token"
              value={settings.meta_page_access_token}
              onChange={handleChange}
              placeholder="Escribe el token de Meta (empieza con EAAB...)"
              hint="Token de acceso de larga duración generado desde el Portal de Desarrolladores de Meta (Graph API Explorer) con permisos de publicación."
            />
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