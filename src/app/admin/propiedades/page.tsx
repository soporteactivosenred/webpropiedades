'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import type { Database } from '@/types';

type Property = Database['public']['Tables']['properties']['Row'];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
  sold: { label: 'Vendido', color: 'bg-blue-100 text-blue-800' },
  rented: { label: 'Arrendado', color: 'bg-purple-100 text-purple-800' },
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

  useEffect(() => {
    fetchProperties();
  }, [statusFilter, typeFilter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient();
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      if (typeFilter) {
        query = query.eq('property_type', typeFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setProperties(data || []);
    } catch (err) {
      setError('Error al cargar propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(id);
    try {
      const supabase = createAdminBrowserClient();
      const { error: deleteError } = await supabase.from('properties').delete().eq('id', id);

      if (deleteError) {
        alert('Error al eliminar: ' + deleteError.message);
        return;
      }

      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert('Error al eliminar la propiedad');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (property: Property) => {
    const newStatus = property.status === 'active' ? 'draft' : 'active';
    
    try {
      const supabase = createAdminBrowserClient();
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', property.id);

      if (updateError) {
        alert('Error al actualizar: ' + updateError.message);
        return;
      }

      setProperties(properties.map(p => 
        p.id === property.id ? { ...p, status: newStatus } : p
      ));
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  const formatPrice = (price: number, priceType: string) => {
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: priceType === 'rent' ? 'CLP' : 'CLP',
      minimumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-gray-600">Gestiona las propiedades del sitio</p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <span>➕</span>
          Nueva Propiedad
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos</option>
              <option value="draft">Borrador</option>
              <option value="active">Activo</option>
              <option value="sold">Vendido</option>
              <option value="rented">Arrendado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos</option>
              <option value="house">Casa</option>
              <option value="apartment">Departamento</option>
              <option value="land">Terreno</option>
              <option value="commercial">Comercial</option>
              <option value="office">Oficina</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay propiedades que mostrar
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo / Operación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 mr-4 flex items-center justify-center">
                            📷
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-500">{property.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {TYPE_LABELS[property.property_type] || property.property_type}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {PRICE_TYPE_LABELS[property.price_type] || property.price_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {formatPrice(property.price, property.price_type)}
                      </span>
                      {property.price_type === 'rent' && (
                        <span className="text-xs text-gray-500">/mes</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${STATUS_LABELS[property.status]?.color || 'bg-gray-100'}`}>
                        {STATUS_LABELS[property.status]?.label || property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/propiedades/${property.id}`}
                          className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(property)}
                          className={`px-3 py-1 text-sm rounded ${
                            property.status === 'active'
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {property.status === 'active' ? 'Ocultar' : 'Publicar'}
                        </button>
                        <Link
                          href={`/propiedades/${property.slug}`}
                          target="_blank"
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                        >
                          Ver
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={deleting === property.id}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                        >
                          {deleting === property.id ? '...' : 'Eliminar'}
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