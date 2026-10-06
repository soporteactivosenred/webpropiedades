import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'properties';
    const customFileName = formData.get('fileName') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension and filename
    const originalExt = file.name.split('.').pop() || 'webp';
    const ext = originalExt.toLowerCase();
    const baseName = customFileName
      ? customFileName.replace(/[^a-zA-Z0-9_-]/g, '_')
      : `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const fileNameWithExt = baseName.endsWith(`.${ext}`) ? baseName : `${baseName}.${ext}`;
    const key = `${folder.replace(/^\/|\/$/g, '')}/${fileNameWithExt}`;

    const publicUrl = await uploadToR2({
      key,
      buffer,
      contentType: file.type || 'image/webp',
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
    });
  } catch (error: any) {
    console.error('Error subiendo imagen a Cloudflare R2:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la subida del archivo.' },
      { status: 500 }
    );
  }
}
