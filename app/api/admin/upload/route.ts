import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ensureAdmin } from '@/lib/auth/guard';
import { newId } from '@/lib/data/store';

// Local file upload to /public/uploads. For production swap with S3/Cloudinary.
// The frontend can pass a FormData with a single 'file' field.

const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf']);
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  const guard = await ensureAdmin();
  if (guard) return guard;

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large (max 25 MB)' }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
    const filename = `${newId('up')}${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buf);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
