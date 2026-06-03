'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib';

const navigation = [
  { name: 'Propiedades', href: '/propiedades' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Acceso a créditos', href: '/creditos' },
  { name: 'Blog', href: '/blog' },
  { name: 'Vender', href: '/vender-mi-propiedad' },
  { name: 'Contacto', href: '/contacto' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const floating = isHome && !scrolled;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top utility bar ── */}
      <div className="bg-gray-900 text-gray-400 text-xs h-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
          <span className="hidden sm:block">
            Activos en Red &mdash; Expertos inmobiliarios en Chile
          </span>
          <a
            href="tel:+56912345678"
            className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto"
          >
            <Phone className="w-3 h-3" />
            +569 1234 5678
          </a>
        </div>
      </div>

      {/* ── Main nav ── */}
      <div
        className={cn(
          'transition-all duration-300',
          floating ? 'bg-transparent' : 'bg-white shadow-md'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Pill container */}
          <div
            className={cn(
              'flex items-center justify-between px-6 py-3 transition-all duration-300',
              floating
                ? 'bg-white/95 backdrop-blur-md rounded-full shadow-xl'
                : 'bg-transparent'
            )}
          >
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <Image 
                src="/logo.png" 
                alt="Activos en Red" 
                width={200} 
                height={50} 
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-7">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA button */}
            <Link
              href="/contacto"
              className="hidden md:inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-lg shrink-0"
            >
              Contáctanos
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {isOpen && (
            <div className="md:hidden mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
              {navigation.map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors',
                    i < navigation.length - 1 && 'border-b border-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-6 py-4">
                <Link
                  href="/contacto"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-3 rounded-full transition-colors"
                >
                  Contáctanos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Navbar };