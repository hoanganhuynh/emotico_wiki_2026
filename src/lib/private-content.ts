import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

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

export function encryptPrivateContent(content: string, password: string) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
  return JSON.stringify({
    version: 1,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  });
}
