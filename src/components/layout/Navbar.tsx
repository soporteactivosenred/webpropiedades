'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building2, Info, Phone, FileText, User } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/ui';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Propiedades', href: '/propiedades', icon: Building2 },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Nosotros', href: '/nosotros', icon: Info },
  { name: 'Contacto', href: '/contacto', icon: Phone },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Propiedades <span className="text-primary-600">Merino</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" leftIcon={<User className="w-4 h-4" />}>
                Admin
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="sm">Contactar</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full" leftIcon={<User className="w-4 h-4" />}>
                  Panel Admin
                </Button>
              </Link>
              <Link href="/contacto" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Contactar Ahora</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export { Navbar };