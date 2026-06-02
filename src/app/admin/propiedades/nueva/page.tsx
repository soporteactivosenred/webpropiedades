import { PropertyForm } from '@/components/admin/PropertyForm';

export const metadata = {
  title: 'Nueva Propiedad - Panel de Administración',
  description: 'Crear una nueva propiedad',
};

export default function NuevaPropiedadPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nueva Propiedad</h1>
        <p className="text-gray-600">Crea una nueva propiedad para el sitio</p>
      </div>

      <PropertyForm />
    </div>
  );
}