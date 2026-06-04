import { Client } from 'minio';
import { randomUUID } from 'crypto';

// Le back-office tourne sur l'hôte (pas dans le réseau Docker), donc on
// utilise localhost. Le navigateur (front-end) accède aussi à MinIO via
// localhost — donc l'URL publique stockée en DB peut être la même.
export const MINIO_BUCKET = process.env.MINIO_BUCKET ?? 'althea-images';
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT ?? 'localhost';
const MINIO_PORT = Number(process.env.MINIO_PORT ?? 9000);
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';
const MINIO_PUBLIC_URL =
  process.env.MINIO_PUBLIC_URL ?? `http://${MINIO_ENDPOINT}:${MINIO_PORT}`;

export const minioClient = new Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
});

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const isAllowedImage = (mimetype: string) => ALLOWED_MIMES.has(mimetype);

export const extFromMime = (mimetype: string) => {
  switch (mimetype) {
    case 'image/jpeg': return 'jpg';
    case 'image/png':  return 'png';
    case 'image/webp': return 'webp';
    case 'image/gif':  return 'gif';
    default: return 'bin';
  }
};

export const publicUrl = (objectKey: string) =>
  `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${objectKey}`;

export const uploadBuffer = async (
  prefix: string,
  buffer: Buffer,
  mimetype: string,
): Promise<{ key: string; url: string }> => {
  const ext = extFromMime(mimetype);
  const key = `${prefix}/${randomUUID()}.${ext}`;
  await minioClient.putObject(MINIO_BUCKET, key, buffer, buffer.length, {
    'Content-Type': mimetype,
  });
  return { key, url: publicUrl(key) };
};

export const tryDeleteByUrl = async (url: string | null | undefined) => {
  if (!url) return;
  const prefix = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/`;
  if (!url.startsWith(prefix)) return; // pas une URL MinIO connue, on laisse
  const key = url.slice(prefix.length);
  try {
    await minioClient.removeObject(MINIO_BUCKET, key);
  } catch (err) {
    console.warn('[minio] removeObject failed for', key, err);
  }
};
