import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Database } from '@/types';

export const metadata = {
  title: 'Dashboard - Panel de Administración',
  description: 'Resumen del panel de administración',
};

async function getAdminData() {
  const supabase = await createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().then(c => c.get(name)?.value);
        },
      },
    }
  );

  // Get property stats
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const { count: activeProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get new leads count
  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  // Get blog posts count
  const { count: totalPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  return {
    totalProperties: totalProperties || 0,
    activeProperties: activeProperties || 0,
    recentLeads: recentLeads || [],
    newLeads: newLeads || 0,
    totalPosts: totalPosts || 0,
  };
}

export default async function AdminDashboard() {
  const data = await getAdminData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu sitio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Propiedades"
          value={data.totalProperties}
          icon="🏠"
          href="/admin/propiedades"
        />
        <StatCard
          title="Propiedades Activas"
          value={data.activeProperties}
          icon="✅"
          href="/admin/propiedades"
        />
        <StatCard
          title="Leads Nuevos"
          value={data.newLeads}
          icon="📋"
          href="/admin/leads"
        />
        <StatCard
          title="Artículos Blog"
          value={data.totalPosts}
          icon="📝"
          href="/admin/blog"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/propiedades/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>➕</span>
            Nueva Propiedad
          </Link>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>📝</span>
            Nuevo Artículo
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>📋</span>
            Ver Leads
          </Link>
          <Link
            href="/admin/configuracion"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>⚙️</span>
            Configuración
          </Link>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Leads Recientes</h2>
          <Link
            href="/admin/leads"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Ver todos →
          </Link>
        </div>
        <div className="p-6">
          {data.recentLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay leads recientes</p>
          ) : (
            <div className="space-y-4">
              {data.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      lead.status === 'new' ? 'bg-green-100 text-green-800' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(lead.created_at).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, href }: { title: string; value: number; icon: string; href: string }) {
  return (
    <a href={href} className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </a>
  );
}