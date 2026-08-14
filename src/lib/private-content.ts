import { createDecipheriv, scryptSync } from 'node:crypto';

interface EncryptedDocument {
  version: 1;
  salt: string;
  iv: string;
  tag: string;
  ciphertext: string;
}

export function decryptPrivateContent(serialized: string, password: string) {
  const document = JSON.parse(serialized) as EncryptedDocument;
  if (document.version !== 1) throw new Error('Unsupported private document version');

  const salt = Buffer.from(document.salt, 'base64');
  const iv = Buffer.from(document.iv, 'base64');
  const tag = Buffer.from(document.tag, 'base64');
  const ciphertext = Buffer.from(document.ciphertext, 'base64');
  const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
