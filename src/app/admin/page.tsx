import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Database } from '@/types';
import { Building2, CheckCircle2, UserPlus, FileText, PlusCircle, Settings, ListTodo, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Dashboard - Panel de Administración',
  description: 'Resumen del panel de administración',
};

async function getAdminData() {
  const supabase = (await createServerClient<Database>()) as any;

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Resumen de tu sitio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Propiedades"
          value={data.totalProperties}
          icon={<Building2 className="w-8 h-8 text-primary-500" />}
          href="/admin/propiedades"
        />
        <StatCard
          title="Propiedades Activas"
          value={data.activeProperties}
          icon={<CheckCircle2 className="w-8 h-8 text-green-500" />}
          href="/admin/propiedades"
        />
        <StatCard
          title="Leads Nuevos"
          value={data.newLeads}
          icon={<UserPlus className="w-8 h-8 text-accent-500" />}
          href="/admin/leads"
        />
        <StatCard
          title="Artículos Blog"
          value={data.totalPosts}
          icon={<FileText className="w-8 h-8 text-purple-500" />}
          href="/admin/blog"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/propiedades/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Propiedad
          </Link>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Nuevo Artículo
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            <ListTodo className="w-4 h-4" />
            Ver Leads
          </Link>
          <Link
            href="/admin/configuracion"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </Link>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Leads Recientes</h2>
          <Link
            href="/admin/leads"
            className="text-sm flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6">
          {data.recentLeads.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hay leads recientes</p>
          ) : (
            <div className="space-y-4">
              {data.recentLeads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      lead.status === 'new' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      lead.status === 'contacted' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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

function StatCard({ title, value, icon, href }: { title: string; value: number; icon: React.ReactNode; href: string }) {
  return (
    <a href={href} className="block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {icon}
        </div>
      </div>
    </a>
  );
}