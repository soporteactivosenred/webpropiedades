import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: 'ERROR',
      reason: 'GEMINI_API_KEY no está configurada en las variables de entorno de Vercel.',
    });
  }

  try {
    // Test v1beta
    const resV1beta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const bodyV1beta = await resV1beta.json().catch(() => null);

    // Test v1
    const resV1 = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    const bodyV1 = await resV1.json().catch(() => null);

    const modelsV1beta = bodyV1beta?.models?.map((m: any) => m.name) || [];
    const modelsV1 = bodyV1?.models?.map((m: any) => m.name) || [];

    return NextResponse.json({
      apiKeyConfigured: true,
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
      v1beta: {
        status: resV1beta.status,
        ok: resV1beta.ok,
        error: resV1beta.ok ? null : (bodyV1beta?.error?.message || JSON.stringify(bodyV1beta)),
        modelsCount: modelsV1beta.length,
        generateContentModels: modelsV1beta.filter((n: string) => n.includes('gemini')),
      },
      v1: {
        status: resV1.status,
        ok: resV1.ok,
        error: resV1.ok ? null : (bodyV1?.error?.message || JSON.stringify(bodyV1)),
        modelsCount: modelsV1.length,
        generateContentModels: modelsV1.filter((n: string) => n.includes('gemini')),
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'FETCH_ERROR',
      message: err.message,
    });
  }
}
