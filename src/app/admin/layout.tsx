import { LayoutDashboard, Building2, Users, FileText, Settings, LogOut } from 'lucide-react';

export const metadata = {
  title: 'Panel de Administración',
  description: 'Panel de administración del sitio',
};

// Admin Layout with sidebar navigation
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-primary-950 text-gray-300 min-h-screen fixed left-0 top-0 shadow-xl border-r border-primary-900">
          <div className="p-6">
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
          </div>
          
          <nav className="mt-6">
            <div className="space-y-1">
              <AdminNavItem href="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
              <AdminNavItem href="/admin/propiedades" icon={<Building2 className="w-5 h-5" />} label="Propiedades" />
              <AdminNavItem href="/admin/leads" icon={<Users className="w-5 h-5" />} label="Leads" />
              <AdminNavItem href="/admin/blog" icon={<FileText className="w-5 h-5" />} label="Blog" />
              <AdminNavItem href="/admin/configuracion" icon={<Settings className="w-5 h-5" />} label="Configuración" />
            </div>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6 border-t border-primary-900">
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-primary-900 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
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
      className="flex items-center gap-3 px-6 py-3 text-sm font-medium hover:text-white hover:bg-primary-900 hover:border-r-4 hover:border-accent-500 transition-all"
    >
      <span className="text-primary-400">{icon}</span>
      <span>{label}</span>
    </a>
  );
}