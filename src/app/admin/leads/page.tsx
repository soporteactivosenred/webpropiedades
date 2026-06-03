'use client';

import { useState, useEffect } from 'react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import type { Database } from '@/types';

type Lead = Database['public']['Tables']['leads']['Row'];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Nuevo', color: 'bg-green-100 text-green-800' },
  contacted: { label: 'Contactado', color: 'bg-yellow-100 text-yellow-800' },
  qualified: { label: 'Calificado', color: 'bg-blue-100 text-blue-800' },
  converted: { label: 'Convertido', color: 'bg-purple-100 text-purple-800' },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-800' },
};

const SOURCE_LABELS: Record<string, string> = {
  website: 'Sitio Web',
  whatsapp: 'WhatsApp',
  referral: 'Referido',
  social: 'Redes Sociales',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      if (sourceFilter) {
        query = query.eq('source', sourceFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setLeads(data || []);
    } catch (err) {
      setError('Error al cargar leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(leadId);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: newStatus as Lead['status'] })
        .eq('id', leadId);

      if (updateError) {
        alert('Error al actualizar: ' + updateError.message);
        return;
      }

      setLeads(leads.map(l => 
        l.id === leadId ? { ...l, status: newStatus as Lead['status'] } : l
      ));
      
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as Lead['status'] });
      }
    } catch (err) {
      alert('Error al actualizar el estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600">Gestiona los contactos y consultas</p>
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
              <option value="new">Nuevo</option>
              <option value="contacted">Contactado</option>
              <option value="qualified">Calificado</option>
              <option value="converted">Convertido</option>
              <option value="lost">Perdido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas</option>
              <option value="website">Sitio Web</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="referral">Referido</option>
              <option value="social">Redes Sociales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay leads que mostrar
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{lead.email}</p>
                      {lead.phone && (
                        <p className="text-sm text-gray-500">{lead.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {SOURCE_LABELS[lead.source] || lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={updatingStatus === lead.id}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${STATUS_LABELS[lead.status]?.color || 'bg-gray-100'}`}
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="qualified">Calificado</option>
                        <option value="converted">Convertido</option>
                        <option value="lost">Perdido</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(lead.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Detalle del Lead</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900">{selectedLead.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedLead.email}</p>
                </div>

                {selectedLead.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="text-gray-900">{selectedLead.phone}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Fuente</label>
                  <p className="text-gray-900">{SOURCE_LABELS[selectedLead.source] || selectedLead.source}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${STATUS_LABELS[selectedLead.status]?.color || 'bg-gray-100'}`}>
                    {STATUS_LABELS[selectedLead.status]?.label || selectedLead.status}
                  </span>
                </div>

                {selectedLead.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mensaje</label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLead.message}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de creación</label>
                  <p className="text-gray-900">{formatDate(selectedLead.created_at)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cerrar
                </button>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Enviar Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}