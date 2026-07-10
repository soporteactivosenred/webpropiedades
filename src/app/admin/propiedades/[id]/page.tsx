'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { PropertyForm } from '@/components/admin/PropertyForm';
import type { Database } from '@/types';

type Property = Database['public']['Tables']['properties']['Row'];

export default function EditarPropiedadPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const supabase = createAdminBrowserClient();
        
        // Fetch current user and profile
        const { data: { user } } = await supabase.auth.getUser();
        let userRole = 'user';
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          userRole = profile?.role || 'user';
        }

        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        // Validate agent ownership
        if (userRole === 'agent' && data.agent_id !== user?.id) {
          setError('No tienes permisos de acceso para editar esta propiedad.');
          return;
        }

        setProperty(data);
      } catch (err) {
        setError('Error al cargar la propiedad');
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error || 'Propiedad no encontrada'}</p>
        <a
          href="/admin/propiedades"
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Volver a Propiedades
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Editar Propiedad</h1>
        <p className="text-gray-600">Edita los detalles de la propiedad</p>
      </div>

      <PropertyForm property={property} isEditing />
    </div>
  );
}