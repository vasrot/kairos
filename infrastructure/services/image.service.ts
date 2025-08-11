import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { md5 } from '../../utils/md5';
import { Image } from '../../domain/models/image.model';

const OUTPUT_DIR = process.env.OUTPUT_DIR || path.resolve('data/output');

export type VariantSpec = { width: number };

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function loadInput(source: string): Promise<{ buf: Buffer; originalName: string; ext: string; }>{
  // If it's a public URL (http/https), download; if it's a local path, read
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Could not download image: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const url = new URL(source);
    const originalName = path.basename(url.pathname).split('.')[0] || 'image';
    const ext = path.extname(url.pathname).replace('.', '') || 'jpg';
    return { buf, originalName, ext };
  } else {
    const p = path.resolve(source);
    console.log(`Reading image from: ${p}`);
    const buf = await fs.readFile(p);
    const base = path.basename(p);
    const originalName = base.split('.')[0];
    const ext = path.extname(base).replace('.', '') || 'jpg';

    return { buf, originalName, ext };
  }
}

export async function generateVariants(source: string, widths = [1024, 800]) {
  const { buf, originalName, ext } = await loadInput(source);

  const tasks = widths.map(async (w) => {
    let publicPath: string = '';
    try {
      const outDir = path.join(OUTPUT_DIR, originalName, String(w));
      await ensureDir(outDir);
      const resized = await sharp(buf).resize({ width: w }).toFormat(ext as any, { quality: 85 }).toBuffer();
      const hash = md5(resized);
      const filename = `${hash}.${ext}`;
      const filePath = path.join(outDir, filename);
      await fs.writeFile(filePath, resized);

      publicPath = `/output/${originalName}/${w}/${filename}`;

      const image = new Image(
        `image-${Date.now()}`,
        originalName,
        String(w),
        publicPath,
        hash,
        ext,
        new Date()
      );

      // Simulate saving the image to a database or storage
      console.log(`Image saved: ${JSON.stringify(image)}`);

      return { resolution: String(w), path: publicPath };
    } catch (error) {
      if (error instanceof Error && /Duplicate/.test(error.message)) {
        console.error(`Duplicate error: ${error.message}`);
        await fs.appendFile('logs/error.log', `${new Date().toISOString()} - ${error.message}\n`);
        return { resolution: String(w), path: publicPath, error: 'Duplicate' };
      } else {
        throw error;
      }
    }
  });

  return Promise.all(tasks);
}
