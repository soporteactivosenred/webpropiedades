'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, Plus, Trash2, Edit2, ArrowUp, ArrowDown, Upload, 
  Mail, Phone, Instagram, Linkedin, Check, AlertCircle, 
  ExternalLink, Save, RefreshCw, X, Image as ImageIcon 
} from 'lucide-react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { Button, Input, TextArea } from '@/components/ui';
import { TeamMember, DEFAULT_TEAM } from '@/types';

// Función para recortar y reescalar automáticamente cualquier imagen subida a 500px ancho x 600px alto exactos
function resizeImageTo500x600(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      // Cálculo de recorte estilo "cover" (centrado óptimo)
      const targetRatio = 500 / 600;
      const imgRatio = img.width / img.height;
      let renderWidth = 500;
      let renderHeight = 600;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
        // La imagen es más ancha: ajustamos por altura y recortamos los lados
        renderHeight = 600;
        renderWidth = 600 * imgRatio;
        offsetX = (500 - renderWidth) / 2;
      } else {
        // La imagen es más alta: ajustamos por ancho y recortamos arriba/abajo
        renderWidth = 500;
        renderHeight = 500 / imgRatio;
        offsetY = (600 - renderHeight) / 2;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 500, 600);
      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else resolve(file);
        },
        'image/jpeg',
        0.92
      );
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminEquipoPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estado del modal de edición / creación
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TeamMember>({
    name: '',
    role: '',
    bio: '',
    image: '',
    email: '',
    phone: '',
    instagram: '',
    linkedin: '',
  });

  // Estado de subida de imagen
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase: any = createAdminBrowserClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'team_members')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error al consultar team_members:', error);
      }

      if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
        setMembers(data.value);
      } else {
        // Inicializar con la lista predeterminada
        setMembers(DEFAULT_TEAM);
      }
    } catch (err: any) {
      console.error('Error cargando equipo:', err);
      setMembers(DEFAULT_TEAM);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const supabase: any = createAdminBrowserClient();
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'team_members',
            value: members,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) throw error;

      setSuccessMsg('¡Los datos del equipo fueron guardados exitosamente y ya están visibles en la página Nosotros!');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Error guardando equipo:', err);
      setErrorMsg(`Error al guardar: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({
      id: String(Date.now()),
      name: '',
      role: '',
      bio: '',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=600&fit=crop',
      email: '',
      phone: '',
      instagram: '',
      linkedin: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...members[index] });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg(null);

    try {
      // 1. Recortar y ajustar automáticamente a 500x600 px
      const resizedBlob = await resizeImageTo500x600(file);

      // 2. Subir a Supabase Storage en el bucket properties/team
      const supabase: any = createAdminBrowserClient();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `team/${Date.now()}-${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, resizedBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      if (publicUrl) {
        setFormData((prev) => ({ ...prev, image: publicUrl }));
      }
    } catch (err: any) {
      console.error('Error subiendo foto:', err);
      alert(`No se pudo subir la foto: ${err.message || err}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Por favor, ingresa el nombre del integrante.');
      return;
    }
    if (!formData.role.trim()) {
      alert('Por favor, ingresa el cargo del integrante.');
      return;
    }

    if (editingIndex !== null) {
      // Actualizar existente
      const updated = [...members];
      updated[editingIndex] = formData;
      setMembers(updated);
    } else {
      // Agregar nuevo
      setMembers([...members, formData]);
    }

    closeModal();
  };

  const handleDeleteMember = (index: number) => {
    const memberName = members[index]?.name || 'este integrante';
    if (confirm(`¿Estás seguro de que deseas eliminar a "${memberName}" del equipo?`)) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...members];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setMembers(updated);
  };

  const moveDown = (index: number) => {
    if (index === members.length - 1) return;
    const updated = [...members];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setMembers(updated);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-gray-500 text-sm">Cargando datos del equipo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-primary-50 text-primary-600 rounded-xl">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Equipo</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Administra las fotos (500x600 px), cargos, contactos y redes sociales de los miembros en la página <strong>Nosotros</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/nosotros"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver en la Web</span>
          </Link>

          <Button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm text-xs font-semibold px-4 py-2.5"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Integrante</span>
          </Button>

          <Button
            onClick={handleSaveAll}
            isLoading={saving}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-xs font-bold px-5 py-2.5"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </Button>
        </div>
      </div>

      {/* Notificaciones */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Lista de Miembros en Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member, index) => (
          <div
            key={member.id || member.name + index}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            {/* Foto en proporción exacta 500x600 (5:6) */}
            <div className="relative aspect-[5/6] w-full bg-gray-100 overflow-hidden">
              <Image
                src={member.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=600&fit=crop'}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-lg">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-white hover:text-blue-300 disabled:opacity-30 transition-opacity"
                  title="Mover hacia arriba / adelante"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === members.length - 1}
                  className="p-1 text-white hover:text-blue-300 disabled:opacity-30 transition-opacity"
                  title="Mover hacia abajo / atrás"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-mono">
                500 × 600 px
              </div>
            </div>

            {/* Datos */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mt-1">
                {member.role}
              </p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed flex-1">
                {member.bio}
              </p>

              {/* Contactos */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                {member.email && (
                  <div className="flex items-center gap-1.5 truncate text-[11px]" title={member.email}>
                    <Mail className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  {member.instagram && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-pink-600 bg-pink-50 px-2 py-0.5 rounded">
                      <Instagram className="w-3 h-3" /> IG
                    </span>
                  )}
                  {member.linkedin && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      <Linkedin className="w-3 h-3" /> IN
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(index)}
                  className="flex-1 text-xs py-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Editar
                </Button>
                <button
                  type="button"
                  onClick={() => handleDeleteMember(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar integrante"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón inferior para guardar cambios */}
      {members.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Total de integrantes: <strong>{members.length}</strong> (se distribuirán en 4 columnas, y si hay más de 4, se centrarán en las siguientes filas).
          </p>
          <Button
            onClick={handleSaveAll}
            isLoading={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Guardar Cambios del Equipo
          </Button>
        </div>
      )}

      {/* Modal de Crear / Editar Integrante */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingIndex !== null ? 'Editar Integrante del Equipo' : 'Nuevo Integrante del Equipo'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Ej: Paula Merino Alvarez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Cargo / Rol *
                  </label>
                  <Input
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    placeholder="Ej: Fundadora & Directora Comercial"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Experiencia / Reseña *
                </label>
                <TextArea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleFormChange}
                  placeholder="Ej: Líder estratégica del área de liquidación bancaria e inversiones inmobiliarias..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Correo Electrónico Directo
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleFormChange}
                    placeholder="Ej: contacto@activosenred.cl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Teléfono Directo (con WhatsApp)
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleFormChange}
                    placeholder="Ej: +56973081220"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Instagram (Perfil o URL)
                  </label>
                  <Input
                    name="instagram"
                    value={formData.instagram || ''}
                    onChange={handleFormChange}
                    placeholder="Ej: @paulamerino o https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    LinkedIn (Perfil o URL)
                  </label>
                  <Input
                    name="linkedin"
                    value={formData.linkedin || ''}
                    onChange={handleFormChange}
                    placeholder="Ej: https://linkedin.com/in/..."
                  />
                </div>
              </div>

              {/* Subida y Ajuste de Foto (500x600 px) */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-900 mb-2">
                  Foto de Perfil (Ajuste automático a 500px ancho × 600px alto)
                </label>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Vista previa 5:6 */}
                  <div className="relative w-28 aspect-[5/6] bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 shrink-0">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Previsualización"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-[10px] text-center p-2">
                        <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                        500 × 600
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileSelected}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={uploadingImage}
                        className="w-full sm:w-auto text-xs font-semibold inline-flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-primary-600" />
                        <span>Subir Foto del Integrante</span>
                      </Button>
                      <p className="text-[11px] text-gray-500 mt-1">
                        El sistema reescala, centra y recorta cualquier imagen a <strong>500×600 px</strong> de forma automática antes de subirla.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">
                        O pega directamente el enlace de la imagen:
                      </label>
                      <Input
                        name="image"
                        value={formData.image}
                        onChange={handleFormChange}
                        placeholder="https://images.unsplash.com/..."
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción del modal */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  {editingIndex !== null ? 'Actualizar Integrante' : 'Agregar Integrante'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
