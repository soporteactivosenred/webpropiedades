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
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
          <div className="p-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          <nav className="mt-6">
            <div className="space-y-1">
              <AdminNavItem href="/admin" icon="📊" label="Dashboard" />
              <AdminNavItem href="/admin/propiedades" icon="🏠" label="Propiedades" />
              <AdminNavItem href="/admin/leads" icon="📋" label="Leads" />
              <AdminNavItem href="/admin/blog" icon="📝" label="Blog" />
              <AdminNavItem href="/admin/configuracion" icon="⚙️" label="Configuración" />
            </div>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-left"
              >
                Cerrar Sesión
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

function AdminNavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}