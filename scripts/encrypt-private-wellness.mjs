import fs from 'node:fs';
import crypto from 'node:crypto';

const password = process.env.WIKI_PASSWORD || 'eMoticoSince@2026';
const source = process.argv[2] || '/Volumes/My Passport/emotico 2026/EMOTICO_Dac_ta_Toan_dien_Trac_nghiem_Wellness.md';
const output = process.argv[3] || 'content/private/wellness.enc';
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(fs.readFileSync(source)), cipher.final()]);

fs.writeFileSync(output, JSON.stringify({
  version: 1,
  salt: salt.toString('base64'),
  iv: iv.toString('base64'),
  tag: cipher.getAuthTag().toString('base64'),
  ciphertext: ciphertext.toString('base64'),
}, null, 2) + '\n', { mode: 0o600 });
