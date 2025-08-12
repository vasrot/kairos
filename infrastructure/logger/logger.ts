import fs from 'fs/promises';
import path from 'path';

const LOG_PATH = path.resolve('logs/error.log');

async function append(line: string) {
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    await fs.appendFile(LOG_PATH, line);
  } catch (e) {
    console.error('Logger write failed:', e);
  }
}

export const logger = {
  info: (msg: string) => console.log(msg),
  warn: (msg: string) => console.warn(msg),
  error: async (err: unknown) => {
    const text = typeof err === 'string' ? err : (err as any)?.stack || (err as any)?.message || String(err);
    await append(`[${new Date().toISOString()}] ${text}\n`);
    console.error(text);
  }
};
