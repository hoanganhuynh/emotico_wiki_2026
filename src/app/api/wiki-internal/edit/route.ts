import { NextRequest, NextResponse } from 'next/server';
import { getInternalWikiPage } from '@/lib/wiki-internal';
import { flattenNavItems, NAV_INTERNAL_ITEMS } from '@/lib/nav';
import { verifyWikiSession } from '@/lib/wiki-auth-store';
import { getCurrentWikiDocument, getWikiVersion, getWikiVersionHistory, hasWikiContentDatabase, publishWikiVersion, saveWikiVersion, seedWikiDocument } from '@/lib/wiki-content-store';

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

function changeNote(value: unknown) {
  const note = String(value ?? '').trim();
  if (!note || note.length > 200) return null;
  return note;
}

function documentTitle(value: unknown, fallback: string) {
  const title = String(value ?? '').trim();
  return title.slice(0, 160) || fallback;
}

export async function GET(request: NextRequest) {
  if (!await authorized(request)) return noStore({ error: 'Unauthorized' }, 401);
  const slug = request.nextUrl.searchParams.get('slug') || '';
  const item = allowedPage(slug);
  if (!item) return noStore({ error: 'Wiki page not found' }, 404);
  if (!hasWikiContentDatabase()) return noStore({ error: 'Content database is not configured' }, 503);

  const basePage = getInternalWikiPage(slug);
  if (!basePage) return noStore({ error: 'Wiki page not found' }, 404);
  let current = await getCurrentWikiDocument(slug);
  if (!current) {
    current = await seedWikiDocument(slug, item.label, basePage.content, { category: item.category, visibility: item.visibility || 'internal' });
  }
  const history = await getWikiVersionHistory(slug);
  const title = current?.title || item.label;
  const category = current?.category || item.category || 'Tài nguyên & lịch sử';
  const visibility = current?.visibility || item.visibility || 'internal';
  return noStore({
    page: {
      slug,
      title,
      content: current?.content ?? basePage.content,
      category,
      visibility,
      currentVersionId: current?.currentVersionId ?? null,
      publishedVersionId: current?.publishedVersionId ?? null,
      publishedAt: current?.publishedAt ?? null,
    },
    history,
  });
}

export async function POST(request: NextRequest) {
  if (!await authorized(request)) return noStore({ error: 'Unauthorized' }, 401);
  if (!validOrigin(request)) return noStore({ error: 'Invalid origin' }, 403);
  if (!hasWikiContentDatabase()) return noStore({ error: 'Content database is not configured' }, 503);

  let body: { slug?: string; action?: string; content?: string; title?: string; category?: string; visibility?: 'public' | 'internal'; versionName?: string; changeNote?: string; versionId?: number };
  try { body = await request.json(); } catch { return noStore({ error: 'Invalid JSON' }, 400); }
  const slug = String(body.slug ?? '');
  const item = allowedPage(slug);
  if (!item) return noStore({ error: 'Wiki page not found' }, 404);
  const basePage = getInternalWikiPage(slug);
  if (!basePage) return noStore({ error: 'Wiki page not found' }, 404);

  if (body.action === 'publish') {
    if (!Number.isInteger(body.versionId)) return noStore({ error: 'Version id is required.' }, 400);
    try {
      const published = await publishWikiVersion(slug, Number(body.versionId));
      return noStore({ ok: true, published });
    } catch (error) {
      return noStore({ error: error instanceof Error ? error.message : 'Unable to publish this version.' }, 400);
    }
  }

  const name = versionName(body.versionName);
  if (!name) return noStore({ error: 'Version name is required (maximum 120 characters).' }, 400);
  const note = changeNote(body.changeNote);
  if (!note) return noStore({ error: 'Change note is required (maximum 200 characters).' }, 400);

  let content = body.content;
  if (body.action === 'rollback') {
    if (!Number.isInteger(body.versionId)) return noStore({ error: 'Version id is required.' }, 400);
    const version = await getWikiVersion(slug, Number(body.versionId));
    if (!version) return noStore({ error: 'Version not found.' }, 404);
    content = version.content;
  }
  if (typeof content !== 'string' || content.length > 2_000_000) return noStore({ error: 'Content is empty or too large.' }, 400);

  const saved = await saveWikiVersion(
    slug,
    documentTitle(body.title, item.label),
    content,
    name,
    note,
    { category: body.category || item.category, visibility: body.visibility || item.visibility || 'internal' },
  );
  return noStore({ ok: true, version: saved });
}
