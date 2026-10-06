import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID || '70c5bbb38b24db09e4ef4c05632204ce';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || 'd0730a5059ba221c84da3cea4a3241f1';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '620e62df41e7da150d6f540c930e846f358747221bb8faa956117a42f7d1fa80';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'propiedades-bucket';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://media.activosenred.cl';

/**
 * Uploads a buffer or blob to Cloudflare R2
 */
export async function uploadToR2({
  key,
  buffer,
  contentType = 'image/webp',
}: {
  key: string;
  buffer: Buffer | Uint8Array;
  contentType?: string;
}): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
}

/**
 * Deletes an object from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
}
