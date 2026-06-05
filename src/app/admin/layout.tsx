import { LayoutDashboard, Building2, Users, FileText, Settings, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Panel de Administración — Activos en Red',
  description: 'Panel de administración del sitio',
};

// Admin Layout with sidebar navigation
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1c3a] text-gray-300 min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-40">
        
        {/* Logo Area */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight tracking-wide">ACTIVOS EN RED</p>
              <p className="text-blue-400 text-[10px] uppercase tracking-widest font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-3 mb-3">Navegación</p>
          <div className="space-y-0.5">
            <AdminNavItem href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
            <AdminNavItem href="/admin/propiedades" icon={<Building2 className="w-4 h-4" />} label="Propiedades" />
            <AdminNavItem href="/admin/leads" icon={<Users className="w-4 h-4" />} label="Leads" />
            <AdminNavItem href="/admin/blog" icon={<FileText className="w-4 h-4" />} label="Blog" />
          </div>

          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-3 mt-6 mb-3">Sistema</p>
          <div className="space-y-0.5">
            <AdminNavItem href="/admin/configuracion" icon={<Settings className="w-4 h-4" />} label="Configuración" />
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
            >
              <span className="text-gray-500 group-hover:text-blue-400 transition-colors"><ExternalLink className="w-4 h-4" /></span>
              <span>Ver Sitio Web</span>
            </a>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-gray-800 font-medium">Panel de Control</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/propiedades/nueva"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              Nueva Propiedad
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
    >
      <span className="text-gray-500 group-hover:text-blue-400 transition-colors">{icon}</span>
      <span>{label}</span>
    </a>
  );
}