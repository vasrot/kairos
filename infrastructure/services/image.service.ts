import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { md5 } from '../../utils/md5';
import { ImageModel } from '../persistence/mongoose/image.model';

const OUTPUT_DIR = process.env.OUTPUT_DIR || path.resolve('data/output');

export type VariantSpec = { width: number };

/**
 * Ensures that a directory exists.
 * @param dir Absolute path of the directory to ensure
 */
export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Loads the input image from a URL or local path.
 * @param source Absolute path or URL of the input image
 * @returns Buffer, original name, and extension of the image
 */
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

/**
 * Maps file extensions to Sharp format enums.
 * @param ext File extension
 * @returns Sharp format enum key
 */
function toSharpFormat(ext: string): keyof sharp.FormatEnum {
  const lower = ext.toLowerCase();
  if (lower === 'jpg' || lower === 'jpeg') return 'jpeg';
  if (lower === 'png') return 'png';
  if (lower === 'webp') return 'webp';
  if (lower === 'avif') return 'avif';
  return 'jpeg';
}

/**
 * Generate image variants with specified widths.
 * @param source Absolute path or URL of the input image
 * @param widths Array of target widths for the variants
 * @returns Array of generated image variant metadata
 */
export async function generateVariants(source: string, widths: number[] = [1024, 800]) {
  const { buf, originalName, ext } = await loadInput(source);

  const tasks = widths.map(async (w: number) => {
    let publicPath = '' as string;
    try {
      const outDir = path.join(OUTPUT_DIR, originalName, String(w));
      await ensureDir(outDir);
  const resized = await sharp(buf).resize({ width: w }).toFormat(toSharpFormat(ext), { quality: 85 }).toBuffer();
      const hash = md5(resized);
      const filename = `${hash}.${ext}`;
      const filePath = path.join(outDir, filename);
      await fs.writeFile(filePath, resized);

      publicPath = `/output/${originalName}/${w}/${filename}`;

  const imageDoc = await ImageModel.create({
        originalName,
        resolution: String(w),
        path: publicPath,
        md5: hash,
        ext
      });

      return { resolution: String(w), path: publicPath };
    } catch (error) {
      throw error;
    }
  });

  return Promise.all(tasks);
}
