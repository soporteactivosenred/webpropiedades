'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobilePropiedadesOpen, setIsMobilePropiedadesOpen] = useState(false);
  const [isMobileServiciosOpen, setIsMobileServiciosOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top utility bar ── */}
      <div className="bg-primary-900 text-gray-300 text-xs h-8 flex items-center">
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
          'relative bg-white shadow-md transition-all duration-300'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <Image 
                src="/logo.png" 
                alt="Activos en Red" 
                width={200} 
                height={50} 
                className="h-8 md:h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Inicio */}
              <Link
                href="/"
                className={cn(
                  'text-sm font-medium transition-colors py-2',
                  pathname === '/' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                )}
              >
                Inicio
              </Link>

              {/* Propiedades Dropdown */}
              <div className="relative group py-2">
                <button
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors text-gray-700 hover:text-primary-600 focus:outline-none'
                  )}
                >
                  <span>Propiedades</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/propiedades?type=sale"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    Venta Tradicional
                  </Link>
                  <Link
                    href="/propiedades?type=rent"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    Arriendos
                  </Link>
                </div>
              </div>

              {/* Oportunidades de Inversión (Highlighted Link) */}
              <Link
                href="/propiedades?filter=inversion"
                className={cn(
                  'text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-all duration-300 shadow-sm shrink-0',
                  pathname === '/propiedades' && pathname.includes('filter=inversion')
                    ? 'bg-amber-100 text-amber-800 border-amber-300 scale-95'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:scale-102 hover:shadow-md'
                )}
              >
                Oportunidades de Inversión
              </Link>

              {/* Servicios Dropdown */}
              <div className="relative group py-2">
                <button
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors text-gray-700 hover:text-primary-600 focus:outline-none'
                  )}
                >
                  <span>Servicios</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/contacto?subject=Inversion%20y%20Liquidaciones%20Bancarias"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    Inversión y Liquidaciones Bancarias
                  </Link>
                  <Link
                    href="/contacto?subject=Venta%20y%20Arriendo"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    Venta y Arriendo
                  </Link>
                  <Link
                    href="/contacto?subject=Administracion%20de%20Arriendos"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    Administración de Arriendos
                  </Link>
                  <Link
                    href="/contacto?subject=Tasaciones%20y%20Asesoria%20Legal"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    Tasaciones y Asesoría Legal
                  </Link>
                </div>
              </div>

              {/* Confíanos tu Activo */}
              <Link
                href="/vender-mi-propiedad"
                className={cn(
                  'text-sm font-medium transition-colors py-2 shrink-0',
                  pathname === '/vender-mi-propiedad'
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                )}
              >
                Confíanos tu Activo
              </Link>

              {/* Contacto */}
              <Link
                href="/contacto"
                className={cn(
                  'text-sm font-medium transition-colors py-2',
                  pathname === '/contacto' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                )}
              >
                Contacto
              </Link>
            </nav>

            {/* CTA button */}
            <Link
              href="/contacto"
              className="hidden md:inline-flex items-center bg-primary-600 hover:bg-accent-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all hover:shadow-lg shrink-0"
            >
              Contáctanos
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {isOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-2xl animate-fade-in flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto">
              {/* Inicio */}
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                Inicio
              </Link>

              {/* Propiedades Accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setIsMobilePropiedadesOpen(!isMobilePropiedadesOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Propiedades</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isMobilePropiedadesOpen && "rotate-180")} />
                </button>
                {isMobilePropiedadesOpen && (
                  <div className="bg-gray-50/50 py-1 border-t border-gray-100 animate-slide-down">
                    <Link
                      href="/propiedades?type=sale"
                      onClick={() => setIsOpen(false)}
                      className="block px-10 py-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Venta Tradicional
                    </Link>
                    <Link
                      href="/propiedades?type=rent"
                      onClick={() => setIsOpen(false)}
                      className="block px-10 py-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Arriendos
                    </Link>
                  </div>
                )}
              </div>

              {/* Oportunidades de Inversión */}
              <Link
                href="/propiedades?filter=inversion"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 text-sm font-bold text-amber-700 hover:bg-amber-50/50 border-b border-gray-100 transition-colors bg-amber-50/30"
              >
                Oportunidades de Inversión
              </Link>

              {/* Servicios Accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setIsMobileServiciosOpen(!isMobileServiciosOpen)}
                  className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Servicios</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isMobileServiciosOpen && "rotate-180")} />
                </button>
                {isMobileServiciosOpen && (
                  <div className="bg-gray-50/50 py-1 border-t border-gray-100 animate-slide-down">
                    <Link
                      href="/contacto?subject=Inversion%20y%20Liquidaciones%20Bancarias"
                      onClick={() => setIsOpen(false)}
                      className="block px-10 py-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Inversión y Liquidaciones Bancarias
                    </Link>
                    <Link
                      href="/contacto?subject=Venta%20y%20Arriendo"
                      onClick={() => setIsOpen(false)}
                      className="block px-10 py-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Venta y Arriendo
                    </Link>
                    <Link
                      href="/contacto?subject=Administracion%20de%20Arriendos"
                      onClick={() => setIsOpen(false)}
                      className="block px-10 py-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Administración de Arriendos
                    </Link>
                    <Link
                      href="/contacto?subject=Tasaciones%20y%20Asesoria%20Legal"
                      onClick={() => setIsOpen(false)}
                      className="block px-10 py-3 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Tasaciones y Asesoría Legal
                    </Link>
                  </div>
                )}
              </div>

              {/* Confíanos tu Activo */}
              <Link
                href="/vender-mi-propiedad"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                Confíanos tu Activo
              </Link>

              {/* Contacto */}
              <Link
                href="/contacto"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contacto
              </Link>

              {/* Contact Button */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/20">
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