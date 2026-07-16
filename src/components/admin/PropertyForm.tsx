'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { TextArea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Sparkles, Copy, Check, Wand2, MapPin } from 'lucide-react';
import { cn } from '@/lib';
import type { Database } from '@/types';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyFormProps {
  property?: Property;
  isEditing?: boolean;
}

const PROPERTY_TYPES = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'office', label: 'Oficina' },
  { value: 'industrial', label: 'Industrial' },
];

const PRICE_TYPES = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Arriendo' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'active', label: 'Activo' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Arrendado' },
];

const PROPERTY_FEATURES = [
  'Piscina',
  'Jardín',
  'Estacionamiento',
  'Bodega',
  'Terraza',
  'Quincho',
  'Sala de cine',
  'Gimnasio',
  'Seguridad 24/7',
  'Acceso controlado',
  'Calefacción',
  'Aire acondicionado',
  'Amoblado',
  'Pet friendly',
  'Vista a la ciudad',
  'Balcón',
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

export function PropertyForm({ property, isEditing = false }: PropertyFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: property?.title || '',
    price: property?.price?.toString() || '',
    price_type: property?.price_type || 'sale',
    property_type: property?.property_type || 'house',
    status: property?.status || 'draft',
    is_bank_liquidation: (property as any)?.is_bank_liquidation || false,
    address: property?.address || '',
    city: property?.city || '',
    region: property?.region || '',
    bedrooms: property?.bedrooms?.toString() || '',
    bathrooms: property?.bathrooms?.toString() || '',
    area: property?.area?.toString() || '',
    terrain_area: property?.terrain_area?.toString() || '',
    latitude: property?.latitude?.toString() || '',
    longitude: property?.longitude?.toString() || '',
    parking_spaces: property?.parking_spaces?.toString() || '',
    year_built: property?.year_built?.toString() || '',
    description: property?.description || '',
    features: (property?.features as string[]) || [],
    images: (property?.images as string[]) || [],
    video_url: '',
    // SEO fields
    meta_title: '',
    meta_description: '',
    seo_keywords: '',
    agent_id: (property as any)?.agent_id || '',
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [geocodeSuccess, setGeocodeSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Gemini state variables
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [aiSuggestedDescription, setAiSuggestedDescription] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // User management states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    async function loadUserAndAgents() {
      try {
        const supabase = createAdminBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setUserProfile(profile);

          // If current user is admin, fetch all admin/agent profiles to assign
          if (profile?.role === 'admin') {
            const { data: profilesList } = await supabase
              .from('profiles')
              .select('id, full_name, email')
              .in('role', ['admin', 'agent'])
              .order('full_name', { ascending: true });
            setAgents(profilesList || []);
          }
        }
      } catch (err) {
        console.error('Error loading profiles info:', err);
      }
    }
    loadUserAndAgents();
  }, []);

  const handleGenerateAIDescription = async () => {
    if (!formData.title) {
      setAiError('Por favor ingresa al menos un título para la propiedad antes de generar la sugerencia.');
      return;
    }

    setIsGeneratingDescription(true);
    setAiError(null);
    setAiSuggestedDescription(null);

    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          price: formData.price ? parseFloat(formData.price) : 0,
          price_type: formData.price_type,
          property_type: formData.property_type,
          address: formData.address,
          city: formData.city,
          region: formData.region,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          features: formData.features,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar la descripción.');
      }

      setAiSuggestedDescription(data.suggestion);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Ocurrió un error al contactar al servicio de inteligencia artificial.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleApplySuggestion = () => {
    if (aiSuggestedDescription) {
      setFormData(prev => ({ ...prev, description: aiSuggestedDescription }));
    }
  };

  const handleGeocode = async () => {
    if (!formData.address || !formData.city) return;
    setIsGeocoding(true);
    setGeocodeError(null);
    setGeocodeSuccess(false);

    try {
      const query = encodeURIComponent(`${formData.address}, ${formData.city}, ${formData.region || ''}, Chile`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
        headers: {
          'User-Agent': 'ActivosEnRed-PropertyApp/1.0',
        }
      });
      
      if (!res.ok) throw new Error('Error al conectar con el servicio de geocodificación.');
      
      const data = await res.json();
      
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat).toFixed(6),
          longitude: parseFloat(data[0].lon).toFixed(6),
        }));
        setGeocodeSuccess(true);
      } else {
        setGeocodeError('No se encontraron coordenadas para esta dirección. Por favor ingrésalas manualmente.');
      }
    } catch (err: any) {
      setGeocodeError(err.message || 'Error al geocodificar.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleCopySuggestion = async () => {
    if (aiSuggestedDescription) {
      try {
        await navigator.clipboard.writeText(aiSuggestedDescription);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  // Applies the company logo as a centered, semi-transparent watermark
  const applyWatermark = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const logo = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        logo.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { resolve(file); return; }

          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Scale logo to 30% of image width
          const logoWidth = img.width * 0.30;
          const scale = logoWidth / logo.width;
          const logoHeight = logo.height * scale;

          // Center the logo
          const x = (img.width - logoWidth) / 2;
          const y = (img.height - logoHeight) / 2;

          // Draw logo with 35% opacity
          ctx.globalAlpha = 0.35;
          ctx.drawImage(logo, x, y, logoWidth, logoHeight);
          ctx.globalAlpha = 1.0;

          URL.revokeObjectURL(objectUrl);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          }, file.type || 'image/jpeg', 0.92);
        };
        logo.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); }; // skip watermark on error
        logo.crossOrigin = 'anonymous';
        logo.src = '/logo.png';
      };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Could not load image')); };
      img.src = objectUrl;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const supabase: any = createAdminBrowserClient();
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const slug = generateSlug(formData.title) || 'property';
      const fileName = `${slug}-${Date.now()}-${i}.${fileExt}`;
      const filePath = `images/${fileName}`;

      try {
        // Apply watermark before uploading
        const watermarkedBlob = await applyWatermark(file);

        const { data, error: uploadErr } = await supabase.storage
          .from('properties')
          .upload(filePath, watermarkedBlob, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'image/jpeg',
          });

        if (uploadErr) {
          throw uploadErr;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        if (publicUrl) {
          uploadedUrls.push(publicUrl);
        }
      } catch (err: any) {
        console.error('Error uploading file:', err);
        setUploadError(`Error al subir la imagen "${file.name}": ${err.message || err}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    }

    setIsUploading(false);
    e.target.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase: any = createAdminBrowserClient();
      const slug = isEditing && property ? property.slug : generateSlug(formData.title);

      const propertyData = {
        title: formData.title,
        slug,
        price: parseFloat(formData.price) || 0,
        price_type: formData.price_type as 'sale' | 'rent',
        property_type: formData.property_type as 'house' | 'apartment' | 'land' | 'commercial' | 'office' | 'industrial',
        status: publishNow ? 'active' : (formData.status as 'draft' | 'active' | 'sold' | 'rented'),
        address: formData.address,
        city: formData.city,
        region: formData.region,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        terrain_area: formData.terrain_area ? parseFloat(formData.terrain_area) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        parking_spaces: formData.parking_spaces ? parseInt(formData.parking_spaces) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        description: formData.description,
        features: formData.features,
        images: formData.images,
        is_bank_liquidation: formData.is_bank_liquidation,
        agent_id: userProfile?.role === 'admin' ? (formData.agent_id || null) : (property?.agent_id || currentUser?.id || null),
      };

      let result;
      if (isEditing && property) {
        result = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)
          .select();
      } else {
        result = await supabase
          .from('properties')
          .insert([propertyData])
          .select();
      }

      if (result.error) {
        setError(result.error.message);
        return;
      }

      router.push('/admin/propiedades');
      router.refresh();
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Información Básica</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Título de la Propiedad"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Hermosa casa en Las Condes"
              required
            />
          </div>

          <Select
            label="Tipo de Operación"
            name="price_type"
            value={formData.price_type}
            onChange={handleChange}
            options={PRICE_TYPES}
            required
          />

          <Select
            label="Tipo de Propiedad"
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            options={PROPERTY_TYPES}
            required
          />

          <Input
            label="Precio"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ej: 150000000"
            required
          />

          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
          />

          {userProfile?.role === 'admin' && (
            <Select
              label="Agente Asignado"
              name="agent_id"
              value={formData.agent_id}
              onChange={handleChange}
              options={[
                { value: '', label: 'Sin asignar / Ninguno' },
                ...agents.map(a => ({ value: a.id, label: a.full_name || a.email }))
              ]}
            />
          )}

          <div className="md:col-span-2 flex items-center mt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="is_bank_liquidation"
                checked={formData.is_bank_liquidation}
                onChange={(e) => setFormData(prev => ({ ...prev, is_bank_liquidation: e.target.checked }))}
                className="w-5 h-5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Marcar como Liquidación Bancaria / Adjudicado
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Esta propiedad aparecerá en la sección destacada de oportunidades de inversión.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Ubicación</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Av. Apoquindo 3000"
              required
            />
          </div>

          <Input
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ej: Santiago"
            required
          />

          <Input
            label="Región"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="Ej: Metropolitana"
            required
          />

          <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-750 pt-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Coordenadas del Mapa</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Requeridas para mostrar el mapa en la ficha de propiedad.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGeocode}
                leftIcon={<MapPin className="w-4 h-4" />}
                disabled={isGeocoding || !formData.address || !formData.city}
              >
                {isGeocoding ? 'Buscando...' : 'Buscar Coordenadas'}
              </Button>
            </div>

            {geocodeError && (
              <p className="text-xs text-red-500 mb-3">{geocodeError}</p>
            )}
            {geocodeSuccess && (
              <p className="text-xs text-emerald-500 mb-3">¡Coordenadas encontradas correctamente!</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitud"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Ej: -33.4123"
              />
              <Input
                label="Longitud"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Ej: -70.6045"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Características</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Input
            label="Dormitorios"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Ej: 3"
          />

          <Input
            label="Baños"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Ej: 2"
          />

          <Input
            label="Superficie Construida (m²)"
            name="area"
            type="number"
            value={formData.area}
            onChange={handleChange}
            placeholder="Ej: 120"
          />

          <Input
            label="Superficie Terreno (m²)"
            name="terrain_area"
            type="number"
            value={formData.terrain_area}
            onChange={handleChange}
            placeholder="Ej: 500"
          />

          <Input
            label="Estacionamientos"
            name="parking_spaces"
            type="number"
            value={formData.parking_spaces}
            onChange={handleChange}
            placeholder="Ej: 2"
          />

          <Input
            label="Año de Construcción"
            name="year_built"
            type="number"
            value={formData.year_built}
            onChange={handleChange}
            placeholder="Ej: 2020"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Características Adicionales
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROPERTY_FEATURES.map((feature) => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Descripción</h2>
          
          <button
            type="button"
            disabled={isGeneratingDescription}
            onClick={handleGenerateAIDescription}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all shadow-sm active:scale-95",
              isGeneratingDescription
                ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100 hover:border-primary-300 dark:bg-primary-950/20 dark:border-primary-900 dark:text-primary-300 dark:hover:bg-primary-900/30"
            )}
          >
            {isGeneratingDescription ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Redactando con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                <span>Redactar descripción con IA (Gemini)</span>
              </>
            )}
          </button>
        </div>

        {aiError && (
          <div className="mb-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between">
            <span>{aiError}</span>
            <button type="button" onClick={() => setAiError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">✕</button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <TextArea
              label="Cuerpo de la Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe las características, ventajas y detalles importantes de la propiedad..."
              rows={12}
            />
          </div>

          <div className="flex flex-col border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-900/30">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2.5">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
                Sugerencia Publicitaria (IA Gemini)
              </span>
              {aiSuggestedDescription && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopySuggestion}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-colors shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleApplySuggestion}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-accent-500 hover:bg-accent-600 text-white transition-colors shadow-sm"
                  >
                    <span>Usar Texto</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[280px] text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line font-mono bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800 select-all">
              {aiSuggestedDescription || (
                <span className="text-gray-400 italic">
                  Completa los datos de la propiedad (título, precio, ubicación, etc.) y haz clic en "Redactar descripción con IA" para recibir una sugerencia de copy publicitario optimizada por Gemini.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Imágenes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Opción 1: Agregar por URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Agregar Imagen por URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/imagen.jpg"
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddImage}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* Opción 2: Subir archivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subir desde tu dispositivo (Supabase Storage)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <svg className="w-8.h-8 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16" width="32" height="32">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-primary-600 dark:text-primary-400">Haz clic para subir</span> o arrastra tus imágenes
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="text-sm text-primary-600 dark:text-primary-400 mb-4 animate-pulse">
            Subiendo imágenes, por favor espera...
          </div>
        )}

        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
            {uploadError}
          </div>
        )}

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Error';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Portada
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {formData.images.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No hay imágenes. Agrega URLs de imágenes para la propiedad.
          </p>
        )}
      </div>

      {/* Video Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Video (Opcional)</h2>
        
        <Input
          label="URL del Video de YouTube o Vimeo"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
          hint="Pega el enlace de un video de YouTube o Vimeo para mostrar un recorrido de la propiedad."
        />
      </div>

      {/* SEO Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">SEO (Opcional)</h2>
        <p className="text-sm text-gray-500 mb-4">
          Si no completas estos campos, se usarán los valores predeterminados del sitio.
        </p>
        
        <div className="space-y-4">
          <Input
            label="Título Meta"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleChange}
            placeholder="Título para SEO (máximo 60 caracteres)"
            hint="Títulos más largos serán truncados en los resultados de búsqueda."
          />

          <TextArea
            label="Descripción Meta"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
            placeholder="Descripción para SEO (máximo 160 caracteres)"
            rows={3}
            hint="Una buena descripción mejora el CTR en los resultados de búsqueda."
          />

          <Input
            label="Palabras Clave SEO"
            name="seo_keywords"
            value={formData.seo_keywords}
            onChange={handleChange}
            placeholder="casa, venta, santiago, las condes"
            hint="Separadas por comas. Ej: casa, venta, santiago, departamento"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/propiedades')}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent, false)}
          isLoading={isSubmitting}
        >
          Guardar como Borrador
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
          isLoading={isSubmitting}
        >
          {isEditing ? 'Actualizar y Publicar' : 'Guardar y Publicar'}
        </Button>
      </div>
    </form>
  );
}