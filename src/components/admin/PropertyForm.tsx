'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { TextArea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Sparkles, Copy, Check, Wand2, MapPin, ArrowLeft, ArrowRight, Star, Trash2, GripVertical } from 'lucide-react';
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
    // Social Media Autopublish fields
    publish_to_fb: (property as any)?.publish_to_fb || false,
    publish_to_ig: (property as any)?.publish_to_ig || false,
    social_caption: (property as any)?.social_caption || '',
    // Mercado Libre Autopublish fields
    publish_to_meli: (property as any)?.publish_to_meli || false,
    meli_item_id: (property as any)?.meli_item_id || '',
    meli_permalink: (property as any)?.meli_permalink || '',
    meli_status: (property as any)?.meli_status || '',
    meli_listing_type: (property as any)?.meli_listing_type || 'gold_special',
    // Yapo.cl Autopublish fields
    publish_to_yapo: (property as any)?.publish_to_yapo || false,
    yapo_ad_id: (property as any)?.yapo_ad_id || '',
    yapo_permalink: (property as any)?.yapo_permalink || '',
    yapo_status: (property as any)?.yapo_status || '',
  });

  const [isPublishingMeli, setIsPublishingMeli] = useState(false);
  const [meliPublishResult, setMeliPublishResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const [isPublishingYapo, setIsPublishingYapo] = useState(false);
  const [yapoPublishResult, setYapoPublishResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [geocodeSuccess, setGeocodeSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

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
          if ((profile as any)?.role === 'admin') {
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

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.images.length) return;

    setFormData(prev => {
      const newImages = [...prev.images];
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;
      return { ...prev, images: newImages };
    });
  };

  const handleMakeCoverImage = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const newImages = [...prev.images];
      const [selectedImage] = newImages.splice(index, 1);
      return { ...prev, images: [selectedImage, ...newImages] };
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;

    setFormData(prev => {
      const newImages = [...prev.images];
      const [draggedImg] = newImages.splice(draggedImageIndex, 1);
      newImages.splice(dropIndex, 0, draggedImg);
      return { ...prev, images: newImages };
    });
    setDraggedImageIndex(null);
  };

  const handlePublishMeliNow = async () => {
    if (!property?.id) return;
    setIsPublishingMeli(true);
    setMeliPublishResult(null);
    try {
      const res = await fetch('/api/admin/properties/publish-meli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (data.success) {
        setMeliPublishResult({ success: true, message: data.message });
        setFormData(prev => ({
          ...prev,
          publish_to_meli: true,
          meli_item_id: data.meli_item_id,
          meli_permalink: data.meli_permalink,
          meli_status: 'active',
        }));
      } else {
        setMeliPublishResult({ success: false, error: data.error });
      }
    } catch (err: any) {
      setMeliPublishResult({ success: false, error: err.message });
    } finally {
      setIsPublishingMeli(false);
    }
  };

  const handlePublishYapoNow = async () => {
    if (!property?.id) return;
    setIsPublishingYapo(true);
    setYapoPublishResult(null);
    try {
      const res = await fetch('/api/admin/properties/publish-yapo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      if (data.success) {
        setYapoPublishResult({ success: true, message: data.message });
        setFormData(prev => ({
          ...prev,
          publish_to_yapo: true,
          yapo_ad_id: data.yapo_ad_id,
          yapo_permalink: data.yapo_permalink,
          yapo_status: 'active',
        }));
      } else {
        setYapoPublishResult({ success: false, error: data.error });
      }
    } catch (err: any) {
      setYapoPublishResult({ success: false, error: err.message });
    } finally {
      setIsPublishingYapo(false);
    }
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
        publish_to_fb: formData.publish_to_fb,
        publish_to_ig: formData.publish_to_ig,
        social_caption: formData.social_caption || null,
        publish_to_meli: formData.publish_to_meli,
        meli_listing_type: formData.meli_listing_type,
        publish_to_yapo: formData.publish_to_yapo,
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

      const savedProp = result.data?.[0];

      // Disparar autopublicación en redes si está seleccionado
      if (savedProp?.id && (formData.publish_to_fb || formData.publish_to_ig)) {
        try {
          await fetch('/api/admin/properties/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId: savedProp.id }),
          });
        } catch (pubErr) {
          console.error('Error al autopublicar propiedad en redes:', pubErr);
        }
      }

      // Disparar autopublicación en Mercado Libre si está seleccionado
      if (savedProp?.id && formData.publish_to_meli) {
        try {
          await fetch('/api/admin/properties/publish-meli', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId: savedProp.id }),
          });
        } catch (meliErr) {
          console.error('Error al autopublicar propiedad en Mercado Libre:', meliErr);
        }
      }

      // Disparar autopublicación en Yapo.cl si está seleccionado
      if (savedProp?.id && formData.publish_to_yapo) {
        try {
          await fetch('/api/admin/properties/publish-yapo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId: savedProp.id }),
          });
        } catch (yapoErr) {
          console.error('Error al autopublicar propiedad en Yapo.cl:', yapoErr);
        }
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
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5 font-medium">
              <GripVertical className="w-4 h-4 text-primary-500" />
              <span>Arrastra las imágenes o usa las flechas para ordenar cómo aparecerán en la web y en el carrusel de redes sociales. La primera foto será la portada.</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((url, index) => {
                const isCover = index === 0;
                const isDragging = draggedImageIndex === index;

                return (
                  <div
                    key={`${url}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={cn(
                      "relative group rounded-xl overflow-hidden border-2 transition-all duration-200 bg-gray-100 dark:bg-gray-700/50 cursor-grab active:cursor-grabbing select-none",
                      isCover
                        ? "border-primary-500 shadow-md ring-2 ring-primary-500/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                      isDragging && "opacity-40 border-dashed border-primary-400 scale-95"
                    )}
                  >
                    <img
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-36 object-cover pointer-events-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Error';
                      }}
                    />

                    {/* Position badge / Portada badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
                      {isCover ? (
                        <span className="inline-flex items-center gap-1 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-current text-yellow-300" /> Portada
                        </span>
                      ) : (
                        <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-0.5 rounded-md">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Quick action controls overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 pointer-events-auto">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          title="Eliminar imagen"
                          className="bg-red-500/90 hover:bg-red-600 text-white rounded-lg p-1.5 transition-colors shadow"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-1 bg-black/75 backdrop-blur-sm p-1.5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveImage(index, 'left')}
                            title="Mover a la izquierda / subir posición"
                            className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-25 text-white transition-colors disabled:cursor-not-allowed"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={index === formData.images.length - 1}
                            onClick={() => handleMoveImage(index, 'right')}
                            title="Mover a la derecha / bajar posición"
                            className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-25 text-white transition-colors disabled:cursor-not-allowed"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleMakeCoverImage(index)}
                            title="Establecer como foto de portada"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors shadow-sm"
                          >
                            <Star className="w-3 h-3 fill-current" /> Portada
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

      {/* Social Media Autopublish Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <span>📲</span> Autopublicación en Redes Sociales (Meta Graph API)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Publica esta propiedad automáticamente en tu Página de Facebook y cuenta de Instagram Business al guardar.
        </p>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="publish_to_fb"
                checked={formData.publish_to_fb}
                onChange={(e) => setFormData(prev => ({ ...prev, publish_to_fb: e.target.checked }))}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span>🔵 Publicar en Facebook</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="publish_to_ig"
                checked={formData.publish_to_ig}
                onChange={(e) => setFormData(prev => ({ ...prev, publish_to_ig: e.target.checked }))}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span>📸 Publicar en Instagram</span>
            </label>
          </div>

          {(formData.publish_to_fb || formData.publish_to_ig) && (
            <div className="pt-2 space-y-2">
              <TextArea
                label="Texto / Pie de foto para Redes Sociales (Opcional)"
                name="social_caption"
                value={formData.social_caption}
                onChange={handleChange}
                placeholder="Escribe un mensaje personalizado con emojis y hashtags. Si lo dejas vacío, se generará una bajada atractiva automáticamente con el precio, ubicación y características de la propiedad."
                rows={4}
                hint="Tip: Incluye hashtags relevantes como #Inmobiliaria #Propiedades #Venta"
              />
            </div>
          )}

          {isEditing && (property as any)?.fb_post_id && (
            <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
              ✓ Publicado previamente en Facebook (ID: {(property as any).fb_post_id})
            </p>
          )}

          {isEditing && (property as any)?.ig_media_id && (
            <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
              ✓ Publicado previamente en Instagram (ID: {(property as any).ig_media_id})
            </p>
          )}
        </div>
      </div>

      {/* Mercado Libre Autopublish Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 text-xs px-2 py-0.5 rounded font-black uppercase">Mercado Libre</span>
            Publicación en Mercado Libre y Portal Inmobiliario Chile
          </h2>
          {isEditing && property?.id && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePublishMeliNow}
              isLoading={isPublishingMeli}
              className="border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold"
            >
              {formData.meli_item_id ? '🔄 Sincronizar / Actualizar en Mercado Libre' : '🚀 Publicar en Mercado Libre Ahora'}
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Publica esta propiedad directamente en la red de Mercado Libre Chile y Portal Inmobiliario.
        </p>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="publish_to_meli"
                checked={formData.publish_to_meli}
                onChange={(e) => setFormData(prev => ({ ...prev, publish_to_meli: e.target.checked }))}
                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <span>🟡 Sincronizar automáticamente con Mercado Libre / Portal Inmobiliario</span>
            </label>
          </div>

          {formData.publish_to_meli && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Exposición (Listing Type)
                </label>
                <select
                  name="meli_listing_type"
                  value={formData.meli_listing_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, meli_listing_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="gold_special">Oro Especial (Recomendado)</option>
                  <option value="gold_premium">Oro Premium (Máxima Exposición)</option>
                  <option value="gold">Oro</option>
                  <option value="silver">Plata</option>
                  <option value="free">Gratuita</option>
                </select>
              </div>
            </div>
          )}

          {formData.meli_item_id && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Publicado en Mercado Libre / Portal Inmobiliario (ID: {formData.meli_item_id})
              </span>
              {formData.meli_permalink && (
                <a
                  href={formData.meli_permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-900 underline font-bold flex items-center gap-1"
                >
                  Ver Ficha en Mercado Libre ↗
                </a>
              )}
            </div>
          )}

          {meliPublishResult && (
            <div className={`p-3 rounded-lg border text-xs font-semibold ${
              meliPublishResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {meliPublishResult.success ? meliPublishResult.message : `Error: ${meliPublishResult.error}`}
            </div>
          )}
        </div>
      </div>

      {/* Yapo.cl Autopublish Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-black uppercase">Yapo.cl</span>
            Publicación en Yapo.cl (API / Pack Inmobiliario)
          </h2>
          {isEditing && property?.id && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePublishYapoNow}
              isLoading={isPublishingYapo}
              className="border-red-300 bg-red-50 hover:bg-red-100 text-red-900 text-xs font-semibold"
            >
              {formData.yapo_ad_id ? '🔄 Sincronizar / Actualizar en Yapo.cl' : '🚀 Publicar en Yapo.cl Ahora'}
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Publica esta propiedad directamente en Yapo.cl a través de la API oficial de integración.
        </p>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="publish_to_yapo"
                checked={formData.publish_to_yapo}
                onChange={(e) => setFormData(prev => ({ ...prev, publish_to_yapo: e.target.checked }))}
                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span>🔴 Sincronizar automáticamente con Yapo.cl</span>
            </label>
          </div>

          {formData.yapo_ad_id && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Publicado en Yapo.cl (ID: {formData.yapo_ad_id})
              </span>
              {formData.yapo_permalink && (
                <a
                  href={formData.yapo_permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-900 underline font-bold flex items-center gap-1"
                >
                  Ver Ficha en Yapo.cl ↗
                </a>
              )}
            </div>
          )}

          {yapoPublishResult && (
            <div className={`p-3 rounded-lg border text-xs font-semibold ${
              yapoPublishResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {yapoPublishResult.success ? yapoPublishResult.message : `Error: ${yapoPublishResult.error}`}
            </div>
          )}
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