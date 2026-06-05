import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Database } from '@/types';
import { Building2, CheckCircle2, UserPlus, FileText, PlusCircle, Settings, ListTodo, ArrowRight, TrendingUp, Eye } from 'lucide-react';

export const metadata = {
  title: 'Dashboard — Panel de Administración',
  description: 'Resumen del panel de administración',
};

async function getAdminData() {
  const supabase = (await createServerClient<Database>()) as any;

  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const { count: activeProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido al panel de control de Activos en Red.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Propiedades"
          value={data.totalProperties}
          icon={<Building2 className="w-5 h-5" />}
          href="/admin/propiedades"
          color="blue"
          trend="+0 este mes"
        />
        <StatCard
          title="Propiedades Activas"
          value={data.activeProperties}
          icon={<CheckCircle2 className="w-5 h-5" />}
          href="/admin/propiedades"
          color="green"
          trend="Publicadas"
        />
        <StatCard
          title="Leads Nuevos"
          value={data.newLeads}
          icon={<UserPlus className="w-5 h-5" />}
          href="/admin/leads"
          color="amber"
          trend="Sin responder"
        />
        <StatCard
          title="Artículos Blog"
          value={data.totalPosts}
          icon={<FileText className="w-5 h-5" />}
          href="/admin/blog"
          color="purple"
          trend="Publicados"
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="p-4 space-y-2">
              <QuickAction
                href="/admin/propiedades/nueva"
                icon={<PlusCircle className="w-4 h-4" />}
                label="Nueva Propiedad"
                description="Agregar nueva propiedad al sitio"
                color="blue"
              />
              <QuickAction
                href="/admin/blog"
                icon={<FileText className="w-4 h-4" />}
                label="Nuevo Artículo"
                description="Publicar en el blog"
                color="purple"
              />
              <QuickAction
                href="/admin/leads"
                icon={<ListTodo className="w-4 h-4" />}
                label="Ver Leads"
                description="Gestionar contactos recibidos"
                color="amber"
              />
              <QuickAction
                href="/admin/configuracion"
                icon={<Settings className="w-4 h-4" />}
                label="Configuración"
                description="Ajustes generales del sitio"
                color="gray"
              />
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-900">Leads Recientes</h2>
              <Link
                href="/admin/leads"
                className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {data.recentLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <UserPlus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Sin leads todavía</p>
                  <p className="text-gray-400 text-sm mt-1">Los nuevos contactos aparecerán aquí</p>
                </div>
              ) : (
                data.recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                        {lead.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'new' ? 'bg-green-100 text-green-700' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {lead.status === 'new' ? 'Nuevo' : lead.status === 'contacted' ? 'Contactado' : lead.status}
                      </span>
                      <p className="text-xs text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const colorMap = {
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-100' },
  green:  { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-100' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
  gray:   { bg: 'bg-gray-600',   light: 'bg-gray-100',  text: 'text-gray-600',   ring: 'ring-gray-200' },
};

function StatCard({ title, value, icon, href, color, trend }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  color: keyof typeof colorMap;
  trend: string;
}) {
  const c = colorMap[color];
  return (
    <a href={href} className="group block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${c.light} rounded-xl flex items-center justify-center ${c.text} ring-1 ${c.ring} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{trend}</p>
    </a>
  );
}

function QuickAction({ href, icon, label, description, color }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: keyof typeof colorMap;
}) {
  const c = colorMap[color];
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className={`w-9 h-9 ${c.light} rounded-lg flex items-center justify-center ${c.text} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 truncate">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-gray-500 transition-colors" />
    </Link>
  );
}
