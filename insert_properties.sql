-- Script para insertar propiedades con imagenes locales
-- Ejecuta esto en tu SQL Editor de Supabase

TRUNCATE TABLE public.properties CASCADE;

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Laguna del Mar, La Serena',
  'laguna-del-mar-la-serena-1039',
  'Excelente oportunidad de inversión, departamento en exclusivo condominio de la ciudad. Venta amoblado y equipado
Noveno piso, vista frontal, 3 dormitorios, 2 baños, amplio living comedor, balcón con linda vista a laguna y el mar, agradable cocina tipo americana amoblada y equipada, logia interior, estacionamiento y bodega. Torre Hornitos
Condómino con laguna artificial, playa artificial, piscinas, salida a playa, zona de juegos, quinchos, áreas verdes, amplios espacios, estacionamientos de visitas, conserjerías, etc. De excelente conectividad hacia el centro de la ciudad y avenida del mar
91 m2
Mayores consultas o visitas
+56973081220
PROPIEDADES MERINO',
  5150.0,
  'sale',
  'apartment',
  'active',
  'Laguna del Mar, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  2,
  91,
  1,
  ARRAY['Piscina', 'Bodega', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso porcelanato', 'Conserjería']::text[],
  ARRAY['/properties/laguna-del-mar-la-serena-1039/1.jpg', '/properties/laguna-del-mar-la-serena-1039/2.jpg', '/properties/laguna-del-mar-la-serena-1039/3.png', '/properties/laguna-del-mar-la-serena-1039/4.png', '/properties/laguna-del-mar-la-serena-1039/5.png', '/properties/laguna-del-mar-la-serena-1039/6.png', '/properties/laguna-del-mar-la-serena-1039/7.png', '/properties/laguna-del-mar-la-serena-1039/8.png', '/properties/laguna-del-mar-la-serena-1039/9.png', '/properties/laguna-del-mar-la-serena-1039/10.png', '/properties/laguna-del-mar-la-serena-1039/11.png', '/properties/laguna-del-mar-la-serena-1039/12.png', '/properties/laguna-del-mar-la-serena-1039/13.png', '/properties/laguna-del-mar-la-serena-1039/14.png', '/properties/laguna-del-mar-la-serena-1039/15.png', '/properties/laguna-del-mar-la-serena-1039/16.jpg', '/properties/laguna-del-mar-la-serena-1039/17.jpg', '/properties/laguna-del-mar-la-serena-1039/18.jpg', '/properties/laguna-del-mar-la-serena-1039/19.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Terreno, Ovalle',
  'terreno-ovalle-2001',
  'Terreno Ovalle. LIQUIDACION BANCARIA
Sector Recoleta (las higuerillas-el sauce)
OPORTUNIDAD
Gran oportunidad de inversión, provincia del Limari. Se vende predio agrícola de 59,1 hectáreas, ubicado en el fundo las Higuerillas .
Terreno plano ideal para producción agrícola.
Fundo y estancias Higuerillas, ubicado al norte de la ciudad de Ovalle
Valor 8.900 uf
59,1 hectáreas, en dos terrenos colindantes, cada uno con su rol: 45,6 hectáreas por Fundo y Estancia Higuerillas y 13,5 por sector Laguna Verde.
Suelo de secano
ACCESO DIRECTO DESDE RUTA 43, a 15 minutos
Consultas o visitas
+56973081220
512641730.
PROPIEDADES MERINO',
  8900.0,
  'sale',
  'land',
  'active',
  'Terreno, Ovalle',
  'Ovalle',
  'Coquimbo',
  0,
  0,
  59000,
  0,
  '{}'::text[],
  ARRAY['/properties/terreno-ovalle-2001/1.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'San Joaquín, La Serena',
  'san-joaqun-la-serena-5304',
  'Más Gastos comunes
Condominio Altos de Vista Azul, Alberto Arenas con los Arrayanes. Quinto piso, con ascensor, vista panorámica a la ciudad.
2 dormitorios, 1 baño, amplio living comedor de piso flotante, cocina tipo americana amoblada y equipada, logia interior, balcón, estacionamiento y bodega.
Condominio de fácil y rápido acceso, con acceso controlado y conserjería las 24 hrs, piscinas, áreas verdes, estacionamientos de visitas.
Para mayores consultas o visitas
+5673081220
PROPIEDADES MERINO',
  400000.0,
  'rent',
  'apartment',
  'active',
  'San Joaquín, La Serena',
  'La Serena',
  'Coquimbo',
  2,
  1,
  50,
  1,
  ARRAY['Piscina', 'Bodega', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso flotante', 'Conserjería']::text[],
  ARRAY['/properties/san-joaqun-la-serena-5304/1.png', '/properties/san-joaqun-la-serena-5304/2.png', '/properties/san-joaqun-la-serena-5304/3.png', '/properties/san-joaqun-la-serena-5304/4.png', '/properties/san-joaqun-la-serena-5304/5.png', '/properties/san-joaqun-la-serena-5304/6.png', '/properties/san-joaqun-la-serena-5304/7.png', '/properties/san-joaqun-la-serena-5304/8.png', '/properties/san-joaqun-la-serena-5304/9.png', '/properties/san-joaqun-la-serena-5304/10.png', '/properties/san-joaqun-la-serena-5304/11.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Nova Hacienda, Coquimbo',
  'nova-hacienda-coquimbo-0035',
  '¡TU NUEVO HOGAR TE ESPERA EN COQUIMBO!
¿Buscas una casa lista para mudarte, sin complicaciones y en un sector consolidado? ¡Esta es la oportunidad que estabas esperando!
- Ubicación privilegiada: Horacio Damke, sector Nova Hacienda, Coquimbo. Una zona tranquila, ideal para la vida familiar y con excelente conectividad.
Características que te enamorarán:
· Dos pisos con excelente distribución de espacios.
· 3 Dormitorios amplios y luminosos.
· 2 Baños funcionales para toda la familia.
· SIN DEUDA HIPOTECARIA: ¡Compra rápida y sin trámites pendientes!
Esta propiedad es perfecta tanto para vivir como para inversión, ubicada en un barrio con alta plusvalía y cercanía a servicios esenciales.
✨ ¡No dejes pasar esta oportunidad única!
¿Quieres más información o agendar una visita? Escríbenos por DM o pincha el link en nuestra biografía.
75 m2 construidos
144 m2 terreno
PROPIEDADES MERINO
+56973081220
#VentaCasa #Coquimbo #InmobiliariaChile #AltosDelMirador #NovaHacienda #CasaPropia #SinDeuda #InversionInmobiliaria #ViviendaCoquimbon calle, de excelente conectividad para La Serena y Coquimbo. Barrio cercano a colegios, supermercados y comercio vario.',
  3400.0,
  'sale',
  'house',
  'active',
  'Nova Hacienda, Coquimbo',
  'Coquimbo',
  'Coquimbo',
  3,
  2,
  144,
  1,
  ARRAY['Estacionamiento', 'Cocina amoblada', 'Living piso cerámico']::text[],
  ARRAY['/properties/nova-hacienda-coquimbo-0035/1.jpg', '/properties/nova-hacienda-coquimbo-0035/2.jpg', '/properties/nova-hacienda-coquimbo-0035/3.jpg', '/properties/nova-hacienda-coquimbo-0035/4.jpg', '/properties/nova-hacienda-coquimbo-0035/5.jpg', '/properties/nova-hacienda-coquimbo-0035/6.jpg', '/properties/nova-hacienda-coquimbo-0035/7.jpg', '/properties/nova-hacienda-coquimbo-0035/8.jpg', '/properties/nova-hacienda-coquimbo-0035/9.jpg', '/properties/nova-hacienda-coquimbo-0035/10.jpg', '/properties/nova-hacienda-coquimbo-0035/11.jpg', '/properties/nova-hacienda-coquimbo-0035/12.jpg', '/properties/nova-hacienda-coquimbo-0035/13.jpg', '/properties/nova-hacienda-coquimbo-0035/14.jpg', '/properties/nova-hacienda-coquimbo-0035/15.jpg', '/properties/nova-hacienda-coquimbo-0035/16.jpg', '/properties/nova-hacienda-coquimbo-0035/17.jpg', '/properties/nova-hacienda-coquimbo-0035/18.jpg', '/properties/nova-hacienda-coquimbo-0035/19.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'San Joaquín, La Serena',
  'san-joaqun-la-serena-1036',
  'SIN DEUDA HIPOTECARIA
Condominio Brisas de San Joaquín, segundo piso, 3 dormitorios de piso flotante, 2 baños, uno de ellos en suite, amplio living comedor de piso cerámico, cómoda cocina amoblada y equipada, logia, balcón cerrado, estacionamiento.
Exclusivo condominio en el mejor barrio de la ciudad, conserjería y acceso controlado las 24 hrs, cercano a supermercados, colegios y comercio vario, locomoción a las afueras. Piscinas, lindas áreas verdes, salones multiuso, estacionamientos de visitas
66 m2
Visitas o consultas
+56973081220
512641730
PROPIEDADES MERINO',
  2700.0,
  'sale',
  'apartment',
  'active',
  'San Joaquín, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  2,
  66,
  1,
  ARRAY['Piscina', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso cerámico']::text[],
  ARRAY['/properties/san-joaqun-la-serena-1036/1.jpg', '/properties/san-joaqun-la-serena-1036/2.jpg', '/properties/san-joaqun-la-serena-1036/3.jpg', '/properties/san-joaqun-la-serena-1036/4.jpg', '/properties/san-joaqun-la-serena-1036/5.jpg', '/properties/san-joaqun-la-serena-1036/6.jpg', '/properties/san-joaqun-la-serena-1036/7.jpg', '/properties/san-joaqun-la-serena-1036/8.jpg', '/properties/san-joaqun-la-serena-1036/9.jpg', '/properties/san-joaqun-la-serena-1036/10.jpg', '/properties/san-joaqun-la-serena-1036/11.jpg', '/properties/san-joaqun-la-serena-1036/12.jpg', '/properties/san-joaqun-la-serena-1036/13.jpg', '/properties/san-joaqun-la-serena-1036/14.jpg', '/properties/san-joaqun-la-serena-1036/15.jpg', '/properties/san-joaqun-la-serena-1036/16.jpg', '/properties/san-joaqun-la-serena-1036/17.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Cerro Grande, La Serena',
  'cerro-grande-la-serena-0038',
  'Condominio El Encomendero
LIQUIDACÍON BANCARIA
Excelente oportunidad
Consultar condiciones
Terreno de inmejorable vista panorámica a la ciudad, en exclusivo condominio de La Serena 2.000 m2 de terreno, más casa tipo cabaña de 112 m2 construidos, 3 habitaciones y 2 baño, walk in closet, amplio living comedor, cocina y sector de lavandería.
Disfruta de vivir en el más exclusivo condominio de La Serena, ya consolidado, cercano a colegios de excelencia, supermercado y comercio vario, de muy buena conectividad para La Serena y Coquimbo.
Para mayores consultas o visitas.
+56973081220
PROPIEDADES MERINO',
  7990.0,
  'sale',
  'house',
  'active',
  'Cerro Grande, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  2,
  2000,
  4,
  ARRAY['Estacionamiento', 'Cocina amoblada', 'Living piso cerámico']::text[],
  ARRAY['/properties/cerro-grande-la-serena-0038/1.png', '/properties/cerro-grande-la-serena-0038/2.png', '/properties/cerro-grande-la-serena-0038/3.png', '/properties/cerro-grande-la-serena-0038/4.png', '/properties/cerro-grande-la-serena-0038/5.png', '/properties/cerro-grande-la-serena-0038/6.png', '/properties/cerro-grande-la-serena-0038/7.jpeg', '/properties/cerro-grande-la-serena-0038/8.png', '/properties/cerro-grande-la-serena-0038/9.png', '/properties/cerro-grande-la-serena-0038/10.png', '/properties/cerro-grande-la-serena-0038/11.png', '/properties/cerro-grande-la-serena-0038/12.png', '/properties/cerro-grande-la-serena-0038/13.png', '/properties/cerro-grande-la-serena-0038/14.png', '/properties/cerro-grande-la-serena-0038/15.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Año Corrido, La Serena',
  'ao-corrido-la-serena-5001',
  'Sector Peñuelas.
Condominio Costa Elqui
AMOBLADO
Año corrido. Gastos comunes incluidos.
A pasos del mar
El lugar ideal para vivir y disfrutar.
Departamento amoblado en exclusivo condominio, Costa Elqui, frente a casino Enjoy. Piso 13, 2 dormitorios, 2 baños, agradable y amplio living comedor con cocina tipo americana, balcón con linda vista panorámica poniente, estacionamiento, NO bodega.
Condominio de acceso controlado y conserjería las 24 hrs., de excelente ubicación y muy buena conectividad hacia La Serena y Coquimbo, piscina, salón multiuso, áreas verdes, estacionamientos de visitas, etc.
Para mayores consultas o visitas.
+56973081220
PROPIEDADES MERINO',
  700000.0,
  'rent',
  'apartment',
  'active',
  'Año Corrido, La Serena',
  'Coquimbo',
  'Coquimbo',
  2,
  2,
  75,
  1,
  ARRAY['Piscina', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso porcelanato', 'Conserjería']::text[],
  ARRAY['/properties/ao-corrido-la-serena-5001/1.png', '/properties/ao-corrido-la-serena-5001/2.png', '/properties/ao-corrido-la-serena-5001/3.png', '/properties/ao-corrido-la-serena-5001/4.png', '/properties/ao-corrido-la-serena-5001/5.png', '/properties/ao-corrido-la-serena-5001/6.png', '/properties/ao-corrido-la-serena-5001/7.png', '/properties/ao-corrido-la-serena-5001/8.png', '/properties/ao-corrido-la-serena-5001/9.png', '/properties/ao-corrido-la-serena-5001/10.png', '/properties/ao-corrido-la-serena-5001/11.png', '/properties/ao-corrido-la-serena-5001/12.png', '/properties/ao-corrido-la-serena-5001/13.png', '/properties/ao-corrido-la-serena-5001/14.png', '/properties/ao-corrido-la-serena-5001/15.png', '/properties/ao-corrido-la-serena-5001/16.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'La Serena Norte, La Serena',
  'la-serena-norte-la-serena-0039',
  'Un lugar ideal
A pasos del mar
Parcela de agrado, Faro norte
Amplia casa de dos pisos, tipo parcela de agrado, a pasos del mar, en sector Faro norte o vegas norte.
Dos dormitorios, dos baños, sala de estar, agradable cocina tipo americana amoblada y equipada, gran living comedor living con bosca, linda terraza.
Lindo jardín con riego automático, estacionamiento para varios vehículos.
2.520 m2 terreno
98 m2 construidos
Mayores consultas o visitas
+56973081220
PROPIEDADES MERINO',
  6900.0,
  'sale',
  'house',
  'active',
  'La Serena Norte, La Serena',
  'La Serena',
  'Coquimbo',
  2,
  2,
  2500,
  10,
  ARRAY['Bodega', 'Estacionamiento', 'Cocina amoblada', 'Living piso flotante']::text[],
  ARRAY['/properties/la-serena-norte-la-serena-0039/1.png', '/properties/la-serena-norte-la-serena-0039/2.png', '/properties/la-serena-norte-la-serena-0039/3.png', '/properties/la-serena-norte-la-serena-0039/4.png', '/properties/la-serena-norte-la-serena-0039/5.png', '/properties/la-serena-norte-la-serena-0039/6.png', '/properties/la-serena-norte-la-serena-0039/7.png', '/properties/la-serena-norte-la-serena-0039/8.png', '/properties/la-serena-norte-la-serena-0039/9.png', '/properties/la-serena-norte-la-serena-0039/10.png', '/properties/la-serena-norte-la-serena-0039/11.png', '/properties/la-serena-norte-la-serena-0039/12.png', '/properties/la-serena-norte-la-serena-0039/13.png', '/properties/la-serena-norte-la-serena-0039/14.png', '/properties/la-serena-norte-la-serena-0039/15.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Avenida del Mar, La Serena',
  'avenida-del-mar-la-serena-1042',
  'Condominio Playa Blanca
Valor 3.200 UF
�� ¡LIQUIDACIÓN BANCARIA EN LA SERENA! ��
Excelente oportunidad de inversión.
¡Atención inversionistas y buscadores de oportunidades!
�� Departamento en Avenida Pacífico esquina Las Higueras, con un precio irrepetible y por debajo del valor de mercado.
¿Buscando tu próximo departamento en la playa o una inversión con alta rentabilidad? ¡Esta es la oportunidad que esperabas! ��
Depto en tercer piso, con ascensro, 3 amplios dormitorios, 2 baños, balcon con linda vista, cocina amoblada y equipada, logia interior 76 m2, estacionamiento y bodega.
�� Ubicación Premium: Avenida Pacífico 2401, La Serena. A pasos de la Avenida del Mar, restaurantes, playas y con excelente conectividad.
✨ Ideal para:
· Inversión con alta plusvalía
· Arriendos de temporada (Airbnb)
· Tu escape ideal de fin de semana
�� Beneficios de la Liquidación Bancaria:
· Precio muy inferior al valor comercial
· Compra segura y garantizada
· Gran margen de ganancia a futuro
Propiedad se vende en condiciones de dudas y físicas que presenta, CONSULTE
Para mayores consultas o visitas.
+56973081220
PROPIEDADES MERINO',
  3200.0,
  'sale',
  'apartment',
  'active',
  'Avenida del Mar, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  2,
  80,
  1,
  ARRAY['Piscina', 'Bodega', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso cerámico', 'Conserjería']::text[],
  ARRAY['/properties/avenida-del-mar-la-serena-1042/1.png', '/properties/avenida-del-mar-la-serena-1042/2.png', '/properties/avenida-del-mar-la-serena-1042/3.png', '/properties/avenida-del-mar-la-serena-1042/4.png', '/properties/avenida-del-mar-la-serena-1042/5.png', '/properties/avenida-del-mar-la-serena-1042/6.png', '/properties/avenida-del-mar-la-serena-1042/7.png', '/properties/avenida-del-mar-la-serena-1042/8.png', '/properties/avenida-del-mar-la-serena-1042/9.png', '/properties/avenida-del-mar-la-serena-1042/10.png', '/properties/avenida-del-mar-la-serena-1042/11.png', '/properties/avenida-del-mar-la-serena-1042/12.png', '/properties/avenida-del-mar-la-serena-1042/13.png', '/properties/avenida-del-mar-la-serena-1042/14.png', '/properties/avenida-del-mar-la-serena-1042/15.png', '/properties/avenida-del-mar-la-serena-1042/16.png', '/properties/avenida-del-mar-la-serena-1042/17.png', '/properties/avenida-del-mar-la-serena-1042/18.png', '/properties/avenida-del-mar-la-serena-1042/19.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Nova Hacienda, Coquimbo',
  'nova-hacienda-coquimbo-0033',
  'SIN DEUDA HIPOTECARIA
ES LA OPORTUNIDAD QUE ESTABAS ESPERANDO
CON LA SEGURIDAD QUE TU FAMILIA MERECE.
EXCELENTE PRECIO DE VENTA.
Con una conectividad inigualable hacia La Serena y Coquimbo
Casa en condominio. Dos pisos, 3 dormitorios de piso flotante y con closet, 1 baño, amplio living comedor y cocina tipo americana. gran patio y antejardin con estacionamiento
Barrio creciente y en proceso de consolidación, cercano a colegios, supermercados y comercio vario.
96 m2 terreno
55 m2 construidos
Mayores consultas o visitas
+56973081220
512641730
PROPIEDADES MERINO',
  2400.0,
  'sale',
  'house',
  'active',
  'Nova Hacienda, Coquimbo',
  'Coquimbo',
  'Coquimbo',
  3,
  1,
  96,
  1,
  ARRAY['Estacionamiento', 'Cocina amoblada', 'Living piso cerámico']::text[],
  ARRAY['/properties/nova-hacienda-coquimbo-0033/1.jpg', '/properties/nova-hacienda-coquimbo-0033/2.jpg', '/properties/nova-hacienda-coquimbo-0033/3.jpg', '/properties/nova-hacienda-coquimbo-0033/4.jpg', '/properties/nova-hacienda-coquimbo-0033/5.jpg', '/properties/nova-hacienda-coquimbo-0033/6.jpg', '/properties/nova-hacienda-coquimbo-0033/7.jpg', '/properties/nova-hacienda-coquimbo-0033/8.jpg', '/properties/nova-hacienda-coquimbo-0033/9.jpg', '/properties/nova-hacienda-coquimbo-0033/10.jpg', '/properties/nova-hacienda-coquimbo-0033/11.jpg', '/properties/nova-hacienda-coquimbo-0033/12.jpg', '/properties/nova-hacienda-coquimbo-0033/13.jpg', '/properties/nova-hacienda-coquimbo-0033/14.jpg', '/properties/nova-hacienda-coquimbo-0033/15.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Milagro II, La Serena',
  'milagro-ii-la-serena-5001',
  'Ubica tu empresa en el mejor barrio de La Serena, con publico de alto nivel adquisitivo, El Milagro, Avenida Los Arrayanes a pasos de Avenida Ulriksen, frente a colegio Trinity, sector tranquilo y seguro, de alto flujo vehicular y peatonal, ideal para centros médicos, oficinas corporativas, academias,centros de estética, cafeterías, etc. Ubicada en barrio tranquilo, seguro, de alto y de fácil acceso y conectividad
Dos pisos, con sector de recepción, salón, 2 habitaciones, 2 baños, cocina, estacionamiento para 3 vehículos.
Para mayores consultas o visitas contactarse al
+56973081220
PROPIEDADES MERINO',
  990000.0,
  'rent',
  'house',
  'active',
  'Milagro II, La Serena',
  'La Serena',
  'Coquimbo',
  4,
  3,
  150,
  3,
  ARRAY['Estacionamiento', 'Cocina amoblada']::text[],
  ARRAY['/properties/milagro-ii-la-serena-5001/1.png', '/properties/milagro-ii-la-serena-5001/2.png', '/properties/milagro-ii-la-serena-5001/3.png', '/properties/milagro-ii-la-serena-5001/4.png', '/properties/milagro-ii-la-serena-5001/5.png', '/properties/milagro-ii-la-serena-5001/6.png', '/properties/milagro-ii-la-serena-5001/7.png', '/properties/milagro-ii-la-serena-5001/8.png', '/properties/milagro-ii-la-serena-5001/9.jpg', '/properties/milagro-ii-la-serena-5001/10.jpg', '/properties/milagro-ii-la-serena-5001/11.png', '/properties/milagro-ii-la-serena-5001/12.png', '/properties/milagro-ii-la-serena-5001/13.png', '/properties/milagro-ii-la-serena-5001/14.png', '/properties/milagro-ii-la-serena-5001/15.png', '/properties/milagro-ii-la-serena-5001/16.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Nova Hacienda, Coquimbo',
  'nova-hacienda-coquimbo-1041',
  'Nova Hacienda, Coquimbo.
Condominio Altos del Valle.
Cómodo y amplio departamento en cuarto piso, con ascensor, 3 dormitorios de piso flotante y closet, 2 baños, uno de ellos en suite, agradable living comedor de piso flotante, cocina amoblada y equipada, logia interior, balcón, estacionamiento.
77m2
Condominio en excelente ubicación y conectividad hacia La Serena y Coquimbo.
Lindas áreas verdes, gran piscina, gimnasio, quinchos, salones multiuso, estacionamiento de visitas, etc
Mayores consultas o visitas
+56973081220
PROPIEDADES MERINO',
  3300.0,
  'sale',
  'apartment',
  'active',
  'Nova Hacienda, Coquimbo',
  'Coquimbo',
  'Coquimbo',
  3,
  2,
  77,
  1,
  ARRAY['Piscina', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso cerámico', 'Conserjería']::text[],
  ARRAY['/properties/nova-hacienda-coquimbo-1041/1.jpg', '/properties/nova-hacienda-coquimbo-1041/2.jpg', '/properties/nova-hacienda-coquimbo-1041/3.jpg', '/properties/nova-hacienda-coquimbo-1041/4.jpg', '/properties/nova-hacienda-coquimbo-1041/5.jpg', '/properties/nova-hacienda-coquimbo-1041/6.jpg', '/properties/nova-hacienda-coquimbo-1041/7.jpg', '/properties/nova-hacienda-coquimbo-1041/8.jpg', '/properties/nova-hacienda-coquimbo-1041/9.jpg', '/properties/nova-hacienda-coquimbo-1041/10.jpg', '/properties/nova-hacienda-coquimbo-1041/11.jpg', '/properties/nova-hacienda-coquimbo-1041/12.jpg', '/properties/nova-hacienda-coquimbo-1041/13.jpg', '/properties/nova-hacienda-coquimbo-1041/14.jpg', '/properties/nova-hacienda-coquimbo-1041/15.jpg', '/properties/nova-hacienda-coquimbo-1041/16.jpg', '/properties/nova-hacienda-coquimbo-1041/17.jpg', '/properties/nova-hacienda-coquimbo-1041/18.jpg', '/properties/nova-hacienda-coquimbo-1041/19.jpg', '/properties/nova-hacienda-coquimbo-1041/20.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Puente el Libertador, La Serena',
  'puente-el-libertador-la-serena-0024',
  'Condominio Gabriela Oriente, Calle Balada
SIN DEUDA HIPOTECARIA
¡VIVE A PASOS DE TODO!
CON LA SEGURIDADD QUE TU FAMILIA MERECE
ES LA OPORTUNIDAD QUE ESTABAS ESPERANDO
EXCELENTE PRECIO DE VENTA
2.007 UF
Con una conectividad inigualable hacia el centro de La Serena y ruta cinco, a pasos de supermercados y comercio vario, locomoción a tu esquina.
Cómoda propiedad de dos pisos, en condominio. 3 dormitorios de piso flotante y con closet, baño, agradable cocina tipo americana, living comedor de piso cerámico. Patio y antejardin con estacionamiento.
Ubicada en barrio consolidado, de alta plusvalía, cercana a supermercados y centro de la ciudad, comercio vario y locomoción.
120 m2 terreno
54 m2 construidos
Mayores consultas o visitas
+56973081220
512641730
PROPIEDADES MERINO',
  2007.0,
  'sale',
  'house',
  'active',
  'Puente el Libertador, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  1,
  120,
  1,
  ARRAY['Estacionamiento', 'Cocina tipo americana', 'Living piso cerámico']::text[],
  ARRAY['/properties/puente-el-libertador-la-serena-0024/1.jpg', '/properties/puente-el-libertador-la-serena-0024/2.jpg', '/properties/puente-el-libertador-la-serena-0024/3.jpg', '/properties/puente-el-libertador-la-serena-0024/4.jpg', '/properties/puente-el-libertador-la-serena-0024/5.jpg', '/properties/puente-el-libertador-la-serena-0024/6.jpg', '/properties/puente-el-libertador-la-serena-0024/7.jpg', '/properties/puente-el-libertador-la-serena-0024/8.jpg', '/properties/puente-el-libertador-la-serena-0024/9.jpg', '/properties/puente-el-libertador-la-serena-0024/10.jpg', '/properties/puente-el-libertador-la-serena-0024/11.jpg', '/properties/puente-el-libertador-la-serena-0024/12.jpg', '/properties/puente-el-libertador-la-serena-0024/13.jpg', '/properties/puente-el-libertador-la-serena-0024/14.jpg', '/properties/puente-el-libertador-la-serena-0024/15.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Laguna del Mar, La Serena',
  'laguna-del-mar-la-serena-5003',
  'AÑO CORRIDO
GASTOS COMUNES INCLUIDOS
Exclusivo departamento con vista panorámica al mar, sexto piso con ascensor, 3 dormitorios con closet (una de ellos con vista al mar y en suite), 2 baños, living-comedor con piso de porcelanato, cocina tipo americana amoblada y equipada, gran balcón con vista panorámica, logia, bodega y estacionamiento.
Condominio de acceso controlado y conserjería las 24 hrs; de amplios espacios para disfrutar del sol, gran piscina o laguna artificial navegable, juegos infantiles, quincho, cancha de tenis, salón multiuso, estacionamiento de visitas, etc.
Para mayor información o visitas, consultar al:
+56973081220
PROPIEDADES MERINO',
  990000.0,
  'rent',
  'apartment',
  'active',
  'Laguna del Mar, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  2,
  91,
  1,
  ARRAY['Piscina', 'Bodega', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso porcelanato', 'Conserjería']::text[],
  ARRAY['/properties/laguna-del-mar-la-serena-5003/1.png', '/properties/laguna-del-mar-la-serena-5003/2.png', '/properties/laguna-del-mar-la-serena-5003/3.png', '/properties/laguna-del-mar-la-serena-5003/4.png', '/properties/laguna-del-mar-la-serena-5003/5.png', '/properties/laguna-del-mar-la-serena-5003/6.png', '/properties/laguna-del-mar-la-serena-5003/7.png', '/properties/laguna-del-mar-la-serena-5003/8.png', '/properties/laguna-del-mar-la-serena-5003/9.png', '/properties/laguna-del-mar-la-serena-5003/10.png', '/properties/laguna-del-mar-la-serena-5003/11.png', '/properties/laguna-del-mar-la-serena-5003/12.png', '/properties/laguna-del-mar-la-serena-5003/13.png', '/properties/laguna-del-mar-la-serena-5003/14.png', '/properties/laguna-del-mar-la-serena-5003/15.png', '/properties/laguna-del-mar-la-serena-5003/16.png', '/properties/laguna-del-mar-la-serena-5003/17.png', '/properties/laguna-del-mar-la-serena-5003/18.png', '/properties/laguna-del-mar-la-serena-5003/19.png', '/properties/laguna-del-mar-la-serena-5003/20.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Puertas del Mar, La Serena',
  'puertas-del-mar-la-serena-3001',
  'Amplia propiedad de dos pisos, frente a linda plaza. 3 dormitorios de piso flotante, closet´s, 3 baños, agradable living comedor con piso de cerámico, cocina amoblada y equipada con encimera, horno y campana, logia, patio pavimentado, gran antejardín con estacionamiento para dos vehículos.
Ubicada en barrio consolidado, cercana a Universidades, centro dela ciudad, colegios, Avenida del Mar, mall, etc.
Para mayores consultas o visitas
+56973081220
PROPIEDADES MERINO',
  680000.0,
  'rent',
  'house',
  'active',
  'Puertas del Mar, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  3,
  140,
  1,
  ARRAY['Estacionamiento', 'Cocina amoblada y equipada', 'Living piso cerámico']::text[],
  ARRAY['/properties/puertas-del-mar-la-serena-3001/1.jpg', '/properties/puertas-del-mar-la-serena-3001/2.jpg', '/properties/puertas-del-mar-la-serena-3001/3.jpg', '/properties/puertas-del-mar-la-serena-3001/4.jpg', '/properties/puertas-del-mar-la-serena-3001/5.jpg', '/properties/puertas-del-mar-la-serena-3001/6.jpg', '/properties/puertas-del-mar-la-serena-3001/7.jpg', '/properties/puertas-del-mar-la-serena-3001/8.jpg', '/properties/puertas-del-mar-la-serena-3001/9.jpg', '/properties/puertas-del-mar-la-serena-3001/10.jpg', '/properties/puertas-del-mar-la-serena-3001/11.jpg', '/properties/puertas-del-mar-la-serena-3001/12.jpg', '/properties/puertas-del-mar-la-serena-3001/13.jpg', '/properties/puertas-del-mar-la-serena-3001/14.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Compañia Baja, La Serena',
  'compaia-baja-la-serena-0040',
  'NO DEJES PASAR LA OPORTUNIDAD,
Calle Monjitas poniente.
Cómoda y linda propiedad de 2 pisos, con 4 dormitorios y 1 baño, agradable cocina con comedor de diario, patio pavimentado y techado, antejardin con estacionamiento.
Ubicada en barrio consolidado, con colegios, locomoción a la puerta, comercio vario, etc
90 m2 terreno
51 m2 construidos originales, ampliación de 20 m2
Mayores consultas o visitas
+56973081220
512641730
PROPIEDADES MERINO',
  2450.0,
  'sale',
  'house',
  'active',
  'Compañia Baja, La Serena',
  'La Serena',
  'Coquimbo',
  4,
  1,
  90,
  1,
  ARRAY['Bodega', 'Estacionamiento', 'Cocina tipo americana', 'Living piso cerámico']::text[],
  ARRAY['/properties/compaia-baja-la-serena-0040/1.png', '/properties/compaia-baja-la-serena-0040/2.png', '/properties/compaia-baja-la-serena-0040/3.png', '/properties/compaia-baja-la-serena-0040/4.png', '/properties/compaia-baja-la-serena-0040/5.png', '/properties/compaia-baja-la-serena-0040/6.png', '/properties/compaia-baja-la-serena-0040/7.png', '/properties/compaia-baja-la-serena-0040/8.png', '/properties/compaia-baja-la-serena-0040/9.png', '/properties/compaia-baja-la-serena-0040/10.png', '/properties/compaia-baja-la-serena-0040/11.png', '/properties/compaia-baja-la-serena-0040/12.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Altos del Mirador',
  'altos-del-mirador-0036',
  'Altos del Mirador, Coquimbo.
SIN DEUDA HIPOTECARIA
OPORTUNIDAD. Amplia casa de un piso. 3 dormitorios de piso flotante, 2 baños, uno de ellos en suite, gran living comedor con piso de cerámico, agradable cocina, amplio patio pavimentado, antejardín, estacionamiento para varios vehículos.
136 m2 terreno
57 m2 construidos
Mayores consultas o visitas
+56973081220
512641730.
PROPIEDADE MERINO',
  2400.0,
  'sale',
  'house',
  'active',
  'Altos del Mirador',
  'Coquimbo',
  'Coquimbo',
  3,
  2,
  136,
  3,
  ARRAY['Estacionamiento', 'Cocina si', 'Living piso cerámico']::text[],
  ARRAY['/properties/altos-del-mirador-0036/1.jpg', '/properties/altos-del-mirador-0036/2.jpg', '/properties/altos-del-mirador-0036/3.jpg', '/properties/altos-del-mirador-0036/4.jpg', '/properties/altos-del-mirador-0036/5.jpg', '/properties/altos-del-mirador-0036/6.jpg', '/properties/altos-del-mirador-0036/7.jpg', '/properties/altos-del-mirador-0036/8.jpg', '/properties/altos-del-mirador-0036/9.jpg', '/properties/altos-del-mirador-0036/10.jpg', '/properties/altos-del-mirador-0036/11.jpg', '/properties/altos-del-mirador-0036/12.jpg', '/properties/altos-del-mirador-0036/13.jpg', '/properties/altos-del-mirador-0036/14.jpg']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Milagro II, La Serena',
  'milagro-ii-la-serena-0037',
  'Excelente oportunidad de inversion, sector de alta plusvalía.
Casa de un piso en tranquilo pasaje. 3 comodos dormitorios de piso flotante y con closet, 1 baño, amplio living comedor, agradable cocina amoblada, gran patio pavimentado, lindo antejardín, estacionamiento para 2 vehículos, bodega.
Barrio consolidado, con colegios, supermercados, transporte público, comercio vario, etc
146 m2 de terreno.
58 m2 construidos
Para mayores consultas o visitas
+56973081220
PROPIEDADES MERINO',
  3200.0,
  'sale',
  'house',
  'active',
  'Milagro II, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  1,
  146,
  2,
  ARRAY['Bodega', 'Estacionamiento', 'Cocina amoblada', 'Living piso flotante']::text[],
  ARRAY['/properties/milagro-ii-la-serena-0037/1.png', '/properties/milagro-ii-la-serena-0037/2.png', '/properties/milagro-ii-la-serena-0037/3.png', '/properties/milagro-ii-la-serena-0037/4.png', '/properties/milagro-ii-la-serena-0037/5.png', '/properties/milagro-ii-la-serena-0037/6.png', '/properties/milagro-ii-la-serena-0037/7.png', '/properties/milagro-ii-la-serena-0037/8.png', '/properties/milagro-ii-la-serena-0037/9.png', '/properties/milagro-ii-la-serena-0037/10.png', '/properties/milagro-ii-la-serena-0037/11.png', '/properties/milagro-ii-la-serena-0037/12.png', '/properties/milagro-ii-la-serena-0037/13.png', '/properties/milagro-ii-la-serena-0037/14.png']::text[]
);

INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Arcos de Pinamar, La Serena',
  'arcos-de-pinamar-la-serena-1040',
  'Excelente oportunidad de inversión.
NO SUBSIDIO
Condominio Eco Barrio
Amplio departamento en cuarto piso, sin ascensor. 3 dormitorios con closet, 2 baños, cómoda cocina amoblada y equipada, living comedor de piso cerámico, logia cerrado, balcón, estacionamiento. NO bodega.
Agradable condominio de acceso controlado y conserjería las 24 hrs., de excelente ubicación y muy buena conectividad hacia la ciudad, piscina, quincho, áreas verdes, estacionamientos de visitas, etc.
68 m2
Propiedad se vende en condiciones físicas y de dudas que presenta, CONSULTE
Para mayores consultas o visitas.
+56973081220
PROPIEDADES MERINO',
  2000.0,
  'sale',
  'apartment',
  'active',
  'Arcos de Pinamar, La Serena',
  'La Serena',
  'Coquimbo',
  3,
  2,
  66,
  1,
  ARRAY['Piscina', 'Estacionamiento', 'Cocina amoblada y equipada', 'Living piso cerámico', 'Conserjería']::text[],
  ARRAY['/properties/arcos-de-pinamar-la-serena-1040/1.png', '/properties/arcos-de-pinamar-la-serena-1040/2.png', '/properties/arcos-de-pinamar-la-serena-1040/3.png', '/properties/arcos-de-pinamar-la-serena-1040/4.png', '/properties/arcos-de-pinamar-la-serena-1040/5.png', '/properties/arcos-de-pinamar-la-serena-1040/6.png', '/properties/arcos-de-pinamar-la-serena-1040/7.png', '/properties/arcos-de-pinamar-la-serena-1040/8.png', '/properties/arcos-de-pinamar-la-serena-1040/9.png', '/properties/arcos-de-pinamar-la-serena-1040/10.png', '/properties/arcos-de-pinamar-la-serena-1040/11.png', '/properties/arcos-de-pinamar-la-serena-1040/12.png', '/properties/arcos-de-pinamar-la-serena-1040/13.png', '/properties/arcos-de-pinamar-la-serena-1040/14.png', '/properties/arcos-de-pinamar-la-serena-1040/15.png', '/properties/arcos-de-pinamar-la-serena-1040/16.png', '/properties/arcos-de-pinamar-la-serena-1040/17.png', '/properties/arcos-de-pinamar-la-serena-1040/18.png']::text[]
);

