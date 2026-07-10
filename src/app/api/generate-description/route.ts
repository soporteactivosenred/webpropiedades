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

REGLAS IMPORTANTES DE FORMATO:
- NO uses formato Markdown bajo ninguna circunstancia.
- NO uses asteriscos (*), doble asterisco (**), almohadillas (#) ni ningún símbolo de Markdown.
- Para los listados usa guiones simples (-) al inicio de cada ítem.
- Escribe el encabezado como texto normal en la primera línea, sin símbolos.
- El texto debe estar listo para pegarse directamente en un formulario de texto plano.

Estructura sugerida de la redacción:
1. Un encabezado o gancho inicial muy llamativo (que no repita exactamente el título de la ficha).
2. Un párrafo introductorio fluido sobre el estilo de vida, comodidad o la excelente ubicación/conectividad de la propiedad.
3. Un listado detallado con guiones (-) agrupando las características del inmueble (distribución interior, estacionamiento, bodega, piscina, etc.) y atributos del entorno.
4. Un cierre persuasivo con llamada a la acción clara para coordinar visitas.

Datos técnicos del inmueble:
${propertyInfo}

Genera únicamente el texto de la descripción comercial en español de manera directa. No incluyas explicaciones de tu lógica de redacción, ni saludos ni notas del sistema fuera de la descripción publicitaria.`;

    // Models confirmed available via /api/admin/gemini-diagnostic
    // Ordered: most capable first, lighter models as fallback
    const attemptsToTry = [
      { version: 'v1beta', model: 'gemini-2.5-flash' },
      { version: 'v1beta', model: 'gemini-2.0-flash' },
      { version: 'v1beta', model: 'gemini-2.0-flash-lite' },
      { version: 'v1beta', model: 'gemini-2.0-flash-001' },
      { version: 'v1beta', model: 'gemini-2.0-flash-lite-001' },
      { version: 'v1beta', model: 'gemini-flash-latest' },
      { version: 'v1beta', model: 'gemini-flash-lite-latest' },
      { version: 'v1beta', model: 'gemini-3.5-flash' },
    ];

    let successResponse: Response | null = null;
    let lastErrorStatus = 502;
    let lastErrorMessage = 'Todos los modelos de Gemini fallaron.';
    let allOverloaded = true;

    for (const { version, model } of attemptsToTry) {
      // Retry up to 2 times per model on 503
      for (let attempt = 0; attempt < 2; attempt++) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (res.ok) {
          successResponse = res;
          console.log(`Gemini OK using model: ${version}/${model}`);
          break;
        }

        const errBody = await res.json().catch(() => ({}));
        const errMsg = errBody?.error?.message || errBody?.error?.status || JSON.stringify(errBody);
        console.warn(`[${version}/${model}] attempt ${attempt + 1} failed (${res.status}): ${errMsg}`);
        lastErrorStatus = res.status;

        if (res.status === 503) {
          // Model overloaded — wait briefly before retry or next model
          lastErrorMessage = 'Los modelos de IA están con alta demanda en este momento. Por favor intenta nuevamente en unos segundos.';
          if (attempt === 0) await new Promise(r => setTimeout(r, 800));
        } else {
          allOverloaded = false;
          lastErrorMessage = `Error Gemini API (HTTP ${res.status}, modelo ${model}): ${errMsg}`;
          break; // Non-503 error, no point retrying this model
        }
      }

      if (successResponse) break;
    }

    if (!successResponse) {
      return NextResponse.json({ error: lastErrorMessage }, { status: lastErrorStatus });
    }

    const data = await successResponse.json();
    const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip any markdown formatting the model might still include
    const suggestedText = rawText
      .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → plain
      .replace(/\*(.+?)\*/g, '$1')         // *italic* → plain
      .replace(/^#{1,6}\s*/gm, '')          // # headings → plain
      .replace(/^\*\s+/gm, '- ')           // * bullet → - bullet
      .replace(/^\s*[-•]\s/gm, '- ')       // normalize bullets
      .trim();

    return NextResponse.json({ suggestion: suggestedText });
  } catch (error: any) {
    console.error('Error en generate-description API Route:', error);
    return NextResponse.json(
      { error: error.message || 'Ocurrió un error al procesar la sugerencia.' },
      { status: 500 }
    );
  }
}
