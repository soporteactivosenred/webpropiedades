-- Script para insertar propiedades scrapeadas de propiedadesmerino.cl
-- Ejecuta esto en tu SQL Editor de Supabase

TRUNCATE TABLE public.properties CASCADE;

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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/147738-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/985811-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/364486-3.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/526959-4.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/922561-5.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/341554-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/961764-7.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/596407-8.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/322569-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/676076-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/174393-11.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/150822-12.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/555912-13.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/967159-14.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/462712-1.png']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/108401-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/496589-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/10170-3.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/328560-4.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/61117-5.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/235760-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/434501-7.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/129653-8.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/939385-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/747890-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/121491-11.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/761375-12.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/421362-13.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/639774-14.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/874637-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/639771-1.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/537528-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/311737-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/187810-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/171573-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/132194-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/185948-7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/195667-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/585183-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/338041-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/612849-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/313487-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/175445-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/14078-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/442685-15.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/893083-16.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/845388-17.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/730920-18.PNG']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/504082-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/860052-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/155388-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/668110-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/678829-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/254112-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/960173-7.jpeg', 'https://www.propiedadesmerino.cl/upload/propiedad/683514-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/715781-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/927256-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/431886-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/296824-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/560881-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/139470-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/165751-15.PNG']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/413885-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/159230-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/601815-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/724661-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/913535-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/766221-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/763388-7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/185778-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/804744-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/830886-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/571602-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/960965-13.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/953456-diseño-sin-título---1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/103649-Diseño sin título - 2.png', 'https://www.propiedadesmerino.cl/upload/propiedad/789422-Diseño sin título - 3.png', 'https://www.propiedadesmerino.cl/upload/propiedad/125666-Diseño sin título - 4.png', 'https://www.propiedadesmerino.cl/upload/propiedad/782225-Diseño sin título - 5.png', 'https://www.propiedadesmerino.cl/upload/propiedad/811142-Diseño sin título - 6.png', 'https://www.propiedadesmerino.cl/upload/propiedad/358471-Diseño sin título - 7.png', 'https://www.propiedadesmerino.cl/upload/propiedad/609841-Diseño sin título - 8.png', 'https://www.propiedadesmerino.cl/upload/propiedad/363900-Diseño sin título - 9.png', 'https://www.propiedadesmerino.cl/upload/propiedad/684121-Diseño sin título - 10.png', 'https://www.propiedadesmerino.cl/upload/propiedad/293968-Diseño sin título - 11.png']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/957824-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/236077-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/116951-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/731752-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/209600-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/455885-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/551034-7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/377882-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/547504-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/917140-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/647040-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/461027-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/619646-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/539091-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/814499-15.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/530505-16.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/784649-17.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/165907-18.PNG']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/941782-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/500435-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/832996-3.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/368861-4.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/273464-5.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/721409-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/454486-7.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/19297-8.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/449497-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/277469-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/83321-11.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/731570-12.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/400379-13.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/676059-14.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/805214-15.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/678026-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/285405-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/657433-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/646135-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/276368-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/755440-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/242147-7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/789909-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/595294-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/786340-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/330776-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/524501-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/393702-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/293444-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/236763-15.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/260793-16.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/10009-17.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/989804-18.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/704836-19.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/983227-20.PNG']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/759683-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/176668-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/910181-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/845329-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/481895-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/14209-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/541925-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/162954-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/921457-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/710134-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/324570-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/761632-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/203442-15.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/882687-16.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/396670-17.PNG']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/482712-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/890082-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/441085-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/855334-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/319259-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/393646-7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/847996-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/664324-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/160032-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/887300-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/973458-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/597114-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/853681-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/468577-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/620352-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/824457-15.PNG']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/789680-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/345223-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/402216-3.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/897548-4.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/728534-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/622375-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/61080-7.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/343804-8.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/25315-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/785241-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/969522-11.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/260988-12.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/130413-13.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/866281-14.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/490663-15.jpg']::text[]
);

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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/804849-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/811747-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/586602-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/562813-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/807295-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/300177-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/163010-7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/903513-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/813006-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/557469-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/334264-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/694086-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/230863-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/214613-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/151845-15.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/128438-17.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/669290-18.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/302157-19.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/152417-20.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/235307-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/5429-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/223213-3.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/850168-4.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/242048-5.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/511585-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/59289-7.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/981022-8.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/641260-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/956670-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/644631-11.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/228361-12.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/34419-13.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/220828-14.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/758276-15.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/719347-16.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/893645-17.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/892922-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/197973-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/716462-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/697090-3.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/582249-4.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/278881-5.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/229848-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/114210-7.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/895692-8.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/824345-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/206471-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/955693-11.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/574261-12.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/552980-13.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/66040-14.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/857959-15.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/928970-17.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/161285-18.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/237970-19.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/339023-1.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/612294-2.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/138953-3.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/689487-4.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/238342-5.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/169856-6.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/392790-7.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/679200-8.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/175942-9.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/135622-10.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/410190-11.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/54303-12.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/543823-13.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/932808-14.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/570789-15.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/275366-16.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/259522-17.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/315146-18.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/548117-19.jpg', 'https://www.propiedadesmerino.cl/upload/propiedad/577217-20.jpg']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/742569-1.png', 'https://www.propiedadesmerino.cl/upload/propiedad/742925-2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/576734-3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/754351-4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/973919-5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/153104-6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/668617-7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/607239-8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/670608-9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/350945-10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/276857-11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/705070-12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/539168-13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/869095-14.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/447931-15.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/189826-16.PNG']::text[]
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
  ARRAY['https://www.propiedadesmerino.cl/upload/propiedad/612314-Diseño sin título - 1.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/946166-Diseño sin título - 2.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/248563-Diseño sin título - 3.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/15510-Diseño sin título - 4.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/322506-Diseño sin título - 5.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/470341-Diseño sin título - 6.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/759958-Diseño sin título - 7.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/472939-Diseño sin título - 8.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/712529-Diseño sin título - 9.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/794784-Diseño sin título - 10.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/954401-Diseño sin título - 11.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/175410-Diseño sin título - 12.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/976048-Diseño sin título - 13.PNG', 'https://www.propiedadesmerino.cl/upload/propiedad/501890-Diseño sin título - 14.PNG']::text[]
);

