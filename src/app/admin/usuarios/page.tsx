'use client';

import { useState, useEffect } from 'react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { Plus, Trash2, Shield, User, Mail, Phone, Lock, X } from 'lucide-react';
import type { Database } from '@/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'agent',
    avatar_url: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndProfiles();
  }, []);

  const fetchUserAndProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createAdminBrowserClient() as any;
      
      // Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        // Fetch current user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setCurrentUserRole(profile?.role || 'user');

        if (profile?.role !== 'admin') {
          setError('No tienes permisos de administrador para ver esta sección.');
          setLoading(false);
          return;
        }
      }

      // Fetch all profiles
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const file = files[0];
    
    // Validate image format
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido.');
      setIsUploading(false);
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('La imagen debe pesar menos de 2MB.');
      setIsUploading(false);
      return;
    }

    const supabase = createAdminBrowserClient() as any;
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    try {
      const { data, error: uploadErr } = await supabase.storage
        .from('properties')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadErr) {
        throw uploadErr;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      if (publicUrl) {
        setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      }
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setUploadError(`Error al subir la imagen: ${err.message || err}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el usuario');
      }

      // Refresh list, close modal, reset form
      await fetchUserAndProfiles();
      setShowModal(false);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'agent',
        avatar_url: '',
      });
      setUploadError(null);
    } catch (err: any) {
      setModalError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (id === currentUser?.id) {
      alert('No puedes eliminar tu propia cuenta.');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el usuario "${email}"? Esta acción borrará permanentemente sus credenciales de acceso.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar el usuario');
      }

      setProfiles(profiles.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Cargando usuarios...</span>
      </div>
    );
  }

  if (error && currentUserRole !== 'admin') {
    return (
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center max-w-lg mx-auto mt-12">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <a
          href="/admin"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          Volver al Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-0.5">Administra las cuentas de administradores y agentes de venta</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Usuario</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-gray-100">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name || 'Avatar'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          profile.full_name?.substring(0, 2).toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{profile.full_name}</p>
                        <p className="text-xs text-gray-400">ID: {profile.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{profile.email}</td>
                    <td className="px-6 py-4 text-gray-500">{profile.phone || 'No registrado'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          profile.role === 'admin'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : profile.role === 'agent'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-gray-50 text-gray-600 border-gray-100'
                        }`}
                      >
                        {profile.role === 'admin' ? 'Administrador' : profile.role === 'agent' ? 'Agente' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {profile.id !== currentUser?.id ? (
                        <button
                          onClick={() => handleDeleteUser(profile.id, profile.email)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic pr-2">Tú</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Registrar Nuevo Usuario</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {modalError && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-2.5 rounded-lg text-xs">
                    {modalError}
                  </div>
                )}

                {/* Avatar File Upload */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Foto de Perfil (Agente)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-105 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {isUploading && <p className="text-xs text-blue-500">Subiendo foto...</p>}
                      {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez"
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-750 text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="juan@activosenred.cl"
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-750 text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contraseña Temporal
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-750 text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Teléfono (Opcional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ej: +56912345678"
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-750 text-sm"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rol / Perfil
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-750 text-sm"
                  >
                    <option value="agent">Agente (Sube y edita propiedades propias)</option>
                    <option value="admin">Administrador (Acceso total)</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-250 rounded-lg text-sm text-gray-600 font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-55 flex items-center gap-1.5"
                >
                  {modalLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>Registrar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
