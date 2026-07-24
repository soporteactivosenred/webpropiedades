'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import type { Database } from '@/types';
import { getPropertyCode } from '@/lib';
import { PlusCircle, Pencil, Eye, EyeOff, Trash2, ExternalLink, Search, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';

type Property = Database['public']['Tables']['properties']['Row'];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft:   { label: 'Borrador', className: 'bg-gray-100 text-gray-600 border border-gray-200' },
  active:  { label: 'Activo',   className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  sold:    { label: 'Vendido',  className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  rented:  { label: 'Arrendado', className: 'bg-purple-50 text-purple-700 border border-purple-200' },
};

const TYPE_LABELS: Record<string, string> = {
  house: 'Casa',
  apartment: 'Departamento',
  land: 'Terreno',
  commercial: 'Comercial',
  office: 'Oficina',
  industrial: 'Industrial',
};

const PRICE_TYPE_LABELS: Record<string, string> = {
  sale: 'Venta',
  rent: 'Arriendo',
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchProperties();
  }, [statusFilter, typeFilter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      
      // Load user profile if not loaded yet
      let profile = userProfile;
      if (!profile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          profile = p;
          setUserProfile(p);
        }
      }

      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (statusFilter) query = query.eq('status', statusFilter);
      if (typeFilter) query = query.eq('property_type', typeFilter);

      // Filter by agent_id if role is agent
      if (profile?.role === 'agent') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('agent_id', user.id);
        }
      }

      const { data, error: fetchError } = await query;
      if (fetchError) { setError(fetchError.message); return; }
      setProperties(data || []);
    } catch {
      setError('Error al cargar propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer.')) return;
    setDeleting(id);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { error: deleteError } = await supabase.from('properties').delete().eq('id', id);
      if (deleteError) { alert('Error al eliminar: ' + deleteError.message); return; }
      setProperties(properties.filter(p => p.id !== id));
    } catch {
      alert('Error al eliminar la propiedad');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (property: Property) => {
    const newStatus = property.status === 'active' ? 'draft' : 'active';
    try {
      const supabase = createAdminBrowserClient() as any;
      const { error: updateError } = await supabase.from('properties').update({ status: newStatus }).eq('id', property.id);
      if (updateError) { alert('Error al actualizar: ' + updateError.message); return; }
      setProperties(properties.map(p => p.id === property.id ? { ...p, status: newStatus } : p));
    } catch {
      alert('Error al actualizar el estado');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', { minimumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-gray-500 mt-0.5">Gestiona las propiedades publicadas en el sitio</p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Propiedad
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          >
            <option value="">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
            <option value="sold">Vendido</option>
            <option value="rented">Arrendado</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          >
            <option value="">Todos los tipos</option>
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
            <option value="land">Terreno</option>
            <option value="commercial">Comercial</option>
            <option value="office">Oficina</option>
            <option value="industrial">Industrial</option>
          </select>
          {(statusFilter || typeFilter) && (
            <button
              onClick={() => { setStatusFilter(''); setTypeFilter(''); }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
          <span className="ml-auto text-sm text-gray-500">{properties.length} resultado{properties.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={fetchProperties} className="mt-2 text-sm text-blue-600 hover:underline">Reintentar</button>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold">No hay propiedades</p>
            <p className="text-gray-400 text-sm mt-1">Intenta cambiar los filtros o crea una nueva propiedad</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Propiedad</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-900 text-white shadow-sm">
                        {getPropertyCode(property)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {property.images && (property.images as string[]).length > 0 ? (
                          <img
                            src={(property.images as string[])[0]}
                            alt={property.title}
                            className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{property.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{property.city}, {property.region}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-800 font-medium">{TYPE_LABELS[property.property_type] || property.property_type}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{PRICE_TYPE_LABELS[property.price_type]}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(property.price)} UF</p>
                      {property.price_type === 'rent' && <span className="text-xs text-gray-400">/mes</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[property.status]?.className || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_CONFIG[property.status]?.label || property.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/propiedades/${property.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(property)}
                          className={`p-2 rounded-lg transition-colors ${
                            property.status === 'active'
                              ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={property.status === 'active' ? 'Despublicar' : 'Publicar'}
                        >
                          {property.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/propiedades/${property.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ver en el sitio"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={deleting === property.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Eliminar"
                        >
                          {deleting === property.id
                            ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
