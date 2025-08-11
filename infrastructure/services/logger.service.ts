import fs from 'fs/promises';
import path from 'path';

const LOG_PATH = path.resolve('logs/error.log');

export class LoggerService {
  async logError(err: Error) {
    const entry = `[${new Date().toISOString()}] ${err?.stack || err?.message || err}\n`;
    try {
      await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
      await fs.appendFile(LOG_PATH, entry);
    } catch (e) {
      console.error('Error writing to log:', e);
    }
  }
}
