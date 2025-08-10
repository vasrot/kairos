import * as imageService from '../../infrastructure/services/image.service';
import fs from 'fs/promises';
import path from 'path';

describe('image.service', () => {
  it('ensureDir crea el directorio si no existe', async () => {
    const testDir = path.resolve('tests/fixtures/tmpdir');
    await fs.rm(testDir, { recursive: true, force: true });
    await imageService.ensureDir(testDir);
    const stat = await fs.stat(testDir);
    expect(stat.isDirectory()).toBe(true);
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('loadInput lee un archivo local', async () => {
    const testImg = path.resolve('tests/fixtures/input/test1.jpg');
    const { buf, originalName, ext } = await imageService.loadInput(testImg);
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(typeof originalName).toBe('string');
    expect(typeof ext).toBe('string');
  });
});
