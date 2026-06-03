# Activos en Red

Inmuebles en Chile - Plataforma de publicación y gestión de propiedades.

## Requisitos

- Node.js 18.17 o superior
- npm o yarn

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd activos-en-red

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env.local

# Editar .env.local con tus credenciales
```

## Variables de Entorno Requeridas

### Supabase (Requerido)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Configuración del Sitio

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_SITE_NAME=Nombre de tu Sitio
```

### Contacto (Opcional)

```env
NEXT_PUBLIC_CONTACT_EMAIL=contacto@tudominio.cl
NEXT_PUBLIC_CONTACT_PHONE=+56912345678
NEXT_PUBLIC_CONTACT_WHATSAPP=56912345678
```

### Email (Opcional - para formulario de contacto)

```env
RESEND_API_KEY=re_tu_api_key
EMAIL_FROM=noreply@tudominio.cl
```

### Analytics (Opcional)

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Scripts Disponibles

```bash
# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start

# Verificar código con ESLint
npm run lint
```

## Desarrollo Local

1. Asegúrate de tener un proyecto en [Supabase](https://supabase.com)
2. Configura las variables de entorno en `.env.local`
3. Ejecuta `npm run dev`
4. Abre [http://localhost:3000](http://localhost:3000)

## Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Click en "New Project"
4. Importa tu repositorio de GitHub
5. Agrega las variables de entorno en la configuración del proyecto:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
6. Click en "Deploy"

### Opción 2: CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### Variables de Entorno en Vercel

Configura las siguientes variables en el dashboard de Vercel:

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo backend) | Sí |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio en producción | Sí |

## Estructura del Proyecto

```
├── src/
│   ├── app/              # Rutas y páginas de Next.js
│   ├── components/       # Componentes React
│   ├── lib/             # Utilidades y configuración
│   ├── middleware.ts    # Middleware de autenticación
│   ├── styles/          # Estilos globales
│   └── types/           # Tipos TypeScript
├── public/              # Archivos estáticos
├── .env.example         # Plantilla de variables de entorno
├── next.config.js       # Configuración de Next.js
├── tailwind.config.js    # Configuración de Tailwind CSS
└── tsconfig.json        # Configuración de TypeScript
```

## Recursos Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Licencia

Privado - Todos los derechos reservados