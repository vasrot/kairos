import fs from 'fs/promises';
import path from 'path';

export type VariantSpec = { width: number };

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function loadInput(source: string): Promise<{ buf: Buffer; originalName: string; ext: string; }>{
  // Si es URL pública (http/https), descargar; si es path local, leer
  console.log(`Cargando imagen desde: ${source}`);

  if (/^https?:\/\//i.test(source)) {
    // Usar fetch nativo en Node.js 22
    const res = await fetch(source);
    if (!res.ok) throw new Error(`No se pudo descargar la imagen: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const url = new URL(source);
    const originalName = path.basename(url.pathname).split('.')[0] || 'image';
    const ext = path.extname(url.pathname).replace('.', '') || 'jpg';
    return { buf, originalName, ext };
  } else {
    const p = path.resolve(source);
    console.log(`Leyendo imagen desde: ${p}`);
    const buf = await fs.readFile(p);
    const base = path.basename(p);
    const originalName = base.split('.')[0];
    const ext = path.extname(base).replace('.', '') || 'jpg';
    return { buf, originalName, ext };
  }
}
