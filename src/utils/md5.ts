import crypto from 'crypto';
export const md5 = (buf: Buffer) => crypto.createHash('md5').update(buf).digest('hex');