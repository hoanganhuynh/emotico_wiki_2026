import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getInternalWikiPage } from '@/lib/wiki-internal';
import { flattenNavItems, NAV_INTERNAL_ITEMS } from '@/lib/nav';
import { getWikiPassword } from '@/lib/wiki-auth';
import { decryptPrivateContent } from '@/lib/private-content';
import { verifyWikiSession } from '@/lib/wiki-auth-store';
import { getCurrentWikiDocument, getWikiVersion, getWikiVersionHistory, hasWikiContentDatabase, saveWikiVersion } from '@/lib/wiki-content-store';

export const runtime = 'nodejs';

function noStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function authorized(request: NextRequest) {
  return verifyWikiSession(request.cookies.get('wiki-auth')?.value);
}

function allowedPage(slug: string) {
  return flattenNavItems(NAV_INTERNAL_ITEMS).find((item) => item.slug === slug) ?? null;
}

function validOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  return origin === new URL(request.url).origin;
}

function versionName(value: unknown) {
  const name = String(value ?? '').trim();
  if (!name || name.length > 120) return null;
  return name;
}

async function editableBaseContent(slug: string, content: string) {
  if (slug !== 'feature-wellness') return content;
  const encrypted = await fs.readFile(path.join(process.cwd(), 'content', 'private', 'wellness.enc'), 'utf8');
  const privateContent = decryptPrivateContent(encrypted, getWikiPassword());
  return content.replace(/<private-section\b[^>]*\/>/, privateContent);
}

export async function GET(request: NextRequest) {
  if (!await authorized(request)) return noStore({ error: 'Unauthorized' }, 401);
  const slug = request.nextUrl.searchParams.get('slug') || '';
  const item = allowedPage(slug);
  if (!item) return noStore({ error: 'Wiki page not found' }, 404);
  if (!hasWikiContentDatabase()) return noStore({ error: 'Content database is not configured' }, 503);

  const basePage = getInternalWikiPage(slug);
  if (!basePage) return noStore({ error: 'Wiki page not found' }, 404);
  const current = await getCurrentWikiDocument(slug);
  const history = await getWikiVersionHistory(slug);
  const baseContent = await editableBaseContent(slug, basePage.content);
  return noStore({
    page: { slug, title: item.label, content: current?.content ?? baseContent },
    history,
  });
}

export async function POST(request: NextRequest) {
  if (!await authorized(request)) return noStore({ error: 'Unauthorized' }, 401);
  if (!validOrigin(request)) return noStore({ error: 'Invalid origin' }, 403);
  if (!hasWikiContentDatabase()) return noStore({ error: 'Content database is not configured' }, 503);

  let body: { slug?: string; action?: string; content?: string; versionName?: string; versionId?: number };
  try { body = await request.json(); } catch { return noStore({ error: 'Invalid JSON' }, 400); }
  const slug = String(body.slug ?? '');
  const item = allowedPage(slug);
  if (!item) return noStore({ error: 'Wiki page not found' }, 404);
  const basePage = getInternalWikiPage(slug);
  if (!basePage) return noStore({ error: 'Wiki page not found' }, 404);

  const name = versionName(body.versionName);
  if (!name) return noStore({ error: 'Version name is required (maximum 120 characters).' }, 400);

  let content = body.content;
  if (body.action === 'rollback') {
    if (!Number.isInteger(body.versionId)) return noStore({ error: 'Version id is required.' }, 400);
    const version = await getWikiVersion(slug, Number(body.versionId));
    if (!version) return noStore({ error: 'Version not found.' }, 404);
    content = version.content;
  }
  if (typeof content !== 'string' || content.length > 2_000_000) return noStore({ error: 'Content is empty or too large.' }, 400);

  const saved = await saveWikiVersion(slug, item.label, content, name);
  return noStore({ ok: true, version: saved });
}
