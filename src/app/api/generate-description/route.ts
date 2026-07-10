import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      price,
      price_type,
      property_type,
      address,
      city,
      region,
      bedrooms,
      bathrooms,
      area,
      features,
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'La API Key de Gemini (GEMINI_API_KEY) no está configurada en el servidor. Por favor configúrala en tus variables de entorno.' },
        { status: 500 }
      );
    }

    const priceLabel = price_type === 'sale' ? 'Venta' : 'Arriendo';
    const typeLabel =
      property_type === 'house'
        ? 'Casa'
        : property_type === 'apartment'
        ? 'Departamento'
        : property_type === 'land'
        ? 'Terreno'
        : property_type === 'commercial'
        ? 'Local comercial'
        : property_type === 'office'
        ? 'Oficina'
        : property_type === 'industrial'
        ? 'Industrial'
        : property_type;

    const propertyInfo = `
      - Título de ficha: ${title || 'N/A'}
      - Tipo de Operación: ${priceLabel}
      - Tipo de Propiedad: ${typeLabel}
      - Valor/Precio: ${price ? price + ' UF o Pesos (según el tipo)' : 'A consultar'}
      - Dirección/Ubicación: ${address || 'N/A'}
      - Comuna/Ciudad: ${city || 'N/A'}
      - Región: ${region || 'N/A'}
      - Dormitorios: ${bedrooms || 'N/A'}
      - Baños: ${bathrooms || 'N/A'}
      - Superficie: ${area ? area + ' m²' : 'N/A'}
      - Atributos/Comodidades: ${features && features.length > 0 ? features.join(', ') : 'Ninguna especificada'}
    `;

    const prompt = `Eres un redactor creativo de marketing y corretaje de propiedades en Chile.
Genera una descripción publicitaria muy atractiva, persuasiva, elegante y optimizada para la venta o arriendo de una propiedad.
El texto debe sonar natural, entusiasta y sumamente profesional, destacando los puntos fuertes de la propiedad para enganchar al potencial comprador o arrendatario.

Estructura sugerida de la redacción:
1. Un encabezado o gancho inicial muy llamativo (que no repita exactamente el título de la ficha).
2. Un párrafo introductorio fluido sobre el estilo de vida, comodidad o la excelente ubicación/conectividad de la propiedad.
3. Un listado detallado (con viñetas limpias) agrupando las características del inmueble (distribución interior, estacionamiento, bodega, piscina, etc.) y atributos del entorno.
4. Un cierre persuasivo con llamada a la acción clara para coordinar visitas.

Datos técnicos del inmueble:
${propertyInfo}

Genera únicamente el texto de la descripción comercial en español de manera directa. No incluyas explicaciones de tu lógica de redacción, ni saludos ni notas del sistema fuera de la descripción publicitaria.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error llamando a Gemini API:', errorData);
      return NextResponse.json(
        { error: 'Error al comunicarse con el motor de IA de Gemini. Verifica la API Key.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const suggestedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ suggestion: suggestedText });
  } catch (error: any) {
    console.error('Error en generate-description API Route:', error);
    return NextResponse.json(
      { error: error.message || 'Ocurrió un error al procesar la sugerencia.' },
      { status: 500 }
    );
  }
}
