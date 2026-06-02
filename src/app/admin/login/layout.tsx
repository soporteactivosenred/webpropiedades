export const metadata = {
  title: 'Iniciar Sesión - Administración',
  description: 'Acceso al panel de administración',
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}