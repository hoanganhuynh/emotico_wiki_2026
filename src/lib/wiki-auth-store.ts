import { neon } from '@neondatabase/serverless';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { getWikiAuthPassword } from '@/lib/wiki-auth';

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const RATE_LIMIT_MAX_FAILURES = 5;
const fallbackRateLimits = new Map<string, { failures: number; resetAt: number }>();

function database() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

export function hasWikiDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function ensureWikiAuthTables() {
  const sql = database();
  if (!sql) return false;

  await sql`
    create table if not exists wiki_auth_config (
      id integer primary key check (id = 1),
      password_hash text not null,
      password_version integer not null default 1,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists wiki_auth_audit (
      id bigserial primary key,
      event text not null,
      created_at timestamptz not null default now(),
      request_ip text,
      user_agent text
    )
  `;
  await sql`
    create table if not exists wiki_auth_rate_limits (
      key text primary key,
      window_started_at timestamptz not null default now(),
      failures integer not null default 0,
      blocked_until timestamptz
    )
  `;
  return true;
}

function encode(value: Buffer) {
  return value.toString('base64url');
}

function decode(value: string) {
  return Buffer.from(value, 'base64url');
}

export function hashWikiPassword(password: string) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 32, { N: 16_384, r: 8, p: 1 });
  return `scrypt$N=16384,r=8,p=1$${encode(salt)}$${encode(derived)}`;
}

export function verifyPasswordHash(password: string, encodedHash: string) {
  const [, params, saltText, hashText] = encodedHash.split('$');
  if (params !== 'N=16384,r=8,p=1' || !saltText || !hashText) return false;
  const expected = decode(hashText);
  const actual = scryptSync(password, decode(saltText), expected.length, { N: 16_384, r: 8, p: 1 });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function storedHash() {
  const sql = database();
  if (!sql) return null;
  await ensureWikiAuthTables();
  const rows = await sql`select password_hash from wiki_auth_config where id = 1 limit 1`;
  return rows[0]?.password_hash ? String(rows[0].password_hash) : null;
}

export async function verifyWikiPassword(password: string) {
  const hash = await storedHash();
  if (hash) return verifyPasswordHash(password, hash);

  const matchesBootstrap = password === getWikiAuthPassword();
  if (matchesBootstrap && hasWikiDatabase()) {
    await setWikiPasswordHash(hashWikiPassword(password), 'bootstrap');
  }
  return matchesBootstrap;
}

export async function getWikiSessionSecret() {
  return (await storedHash()) || getWikiAuthPassword();
}

export function signWikiSession(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export async function verifyWikiSession(value: string | undefined) {
  if (!value) return false;
  const [payload, received] = value.split('.');
  const [sessionType, expiresAtText] = payload?.split(':') || [];
  const expiresAt = Number(expiresAtText);
  if (sessionType !== 'auth' || !payload || !received || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = signWikiSession(payload, await getWikiSessionSecret());
  const actual = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export async function isRateLimited(key: string) {
  const sql = database();
  if (!sql) {
    const item = fallbackRateLimits.get(key);
    if (!item || item.resetAt <= Date.now()) {
      fallbackRateLimits.delete(key);
      return false;
    }
    return item.failures >= RATE_LIMIT_MAX_FAILURES;
  }

  await ensureWikiAuthTables();
  const rows = await sql`select blocked_until from wiki_auth_rate_limits where key = ${key} limit 1`;
  return Boolean(rows[0]?.blocked_until && new Date(String(rows[0].blocked_until)).getTime() > Date.now());
}

export async function recordRateLimitFailure(key: string) {
  const sql = database();
  if (!sql) {
    const current = fallbackRateLimits.get(key);
    const now = Date.now();
    const next = !current || current.resetAt <= now
      ? { failures: 1, resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000 }
      : { failures: current.failures + 1, resetAt: current.resetAt };
    fallbackRateLimits.set(key, next);
    return next.failures >= RATE_LIMIT_MAX_FAILURES;
  }

  await ensureWikiAuthTables();
  const rows = await sql`
    insert into wiki_auth_rate_limits (key, window_started_at, failures, blocked_until)
    values (${key}, now(), 1, null)
    on conflict (key) do update set
      failures = case
        when wiki_auth_rate_limits.window_started_at <= now() - (${RATE_LIMIT_WINDOW_SECONDS} * interval '1 second') then 1
        else wiki_auth_rate_limits.failures + 1
      end,
      window_started_at = case
        when wiki_auth_rate_limits.window_started_at <= now() - (${RATE_LIMIT_WINDOW_SECONDS} * interval '1 second') then now()
        else wiki_auth_rate_limits.window_started_at
      end,
      blocked_until = case
        when wiki_auth_rate_limits.window_started_at <= now() - (${RATE_LIMIT_WINDOW_SECONDS} * interval '1 second') then null
        when wiki_auth_rate_limits.failures + 1 >= ${RATE_LIMIT_MAX_FAILURES} then now() + (${RATE_LIMIT_WINDOW_SECONDS} * interval '1 second')
        else wiki_auth_rate_limits.blocked_until
      end
    returning blocked_until
  `;
  return Boolean(rows[0]?.blocked_until && new Date(String(rows[0].blocked_until)).getTime() > Date.now());
}

export async function clearRateLimit(key: string) {
  const sql = database();
  if (!sql) {
    fallbackRateLimits.delete(key);
    return;
  }
  await ensureWikiAuthTables();
  await sql`delete from wiki_auth_rate_limits where key = ${key}`;
}

export async function setWikiPasswordHash(passwordHash: string, event = 'password_changed', requestIp?: string, userAgent?: string) {
  const sql = database();
  if (!sql) throw new Error('DATABASE_URL is not configured');
  await ensureWikiAuthTables();
  await sql`
    insert into wiki_auth_config (id, password_hash, password_version)
    values (1, ${passwordHash}, 1)
    on conflict (id) do update set
      password_hash = excluded.password_hash,
      password_version = wiki_auth_config.password_version + 1,
      updated_at = now()
  `;
  await sql`
    insert into wiki_auth_audit (event, request_ip, user_agent)
    values (${event}, ${requestIp || null}, ${userAgent || null})
  `;
}

export async function changeWikiPassword(currentPassword: string, newPassword: string, requestIp?: string, userAgent?: string) {
  if (!await verifyWikiPassword(currentPassword)) return false;
  await setWikiPasswordHash(hashWikiPassword(newPassword), 'password_changed', requestIp, userAgent);
  return true;
}

export function sessionExpiry() {
  return Date.now() + SESSION_TTL_SECONDS * 1000;
}

export { SESSION_TTL_SECONDS };
