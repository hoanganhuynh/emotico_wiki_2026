import { neon } from '@neondatabase/serverless';
import { ensureWikiAuthTables } from '@/lib/wiki-auth-store';
import { decryptPrivateContent, encryptPrivateContent } from '@/lib/private-content';
import { getWikiPassword } from '@/lib/wiki-auth';
import { normalizeChangeNote, publicationSnapshot } from './wiki-publication-core.mjs';

export type WikiVisibility = 'public' | 'internal';

export interface WikiVersion {
  id: number;
  slug: string;
  versionName: string;
  title: string;
  changeNote: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface WikiDocument {
  slug: string;
  title: string;
  content: string;
  category: string;
  visibility: WikiVisibility;
  currentVersionId: number | null;
  publishedVersionId: number | null;
  updatedAt: string;
  publishedAt: string | null;
}

export interface PublicWikiUpdate {
  id: number;
  slug: string;
  title: string;
  changeNote: string;
  publishedAt: string;
}

function database() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

export function hasWikiContentDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function ensureWikiContentTables() {
  const sql = database();
  if (!sql) return false;
  await ensureWikiAuthTables();
  await sql`
    create table if not exists wiki_documents (
      slug text primary key,
      title text not null,
      content text not null,
      current_version_id bigint,
      updated_at timestamptz not null default now()
    )
  `;
  await sql`alter table wiki_documents add column if not exists category text not null default 'Tài nguyên & lịch sử'`;
  await sql`alter table wiki_documents add column if not exists visibility text not null default 'internal'`;
  await sql`alter table wiki_documents add column if not exists published_version_id bigint`;
  await sql`alter table wiki_documents add column if not exists published_at timestamptz`;
  await sql`
    create table if not exists wiki_document_versions (
      id bigserial primary key,
      slug text not null,
      version_name text not null,
      content text not null,
      created_at timestamptz not null default now(),
      created_by text not null default 'wiki-internal'
    )
  `;
  await sql`alter table wiki_document_versions add column if not exists title text not null default ''`;
  await sql`alter table wiki_document_versions add column if not exists change_note text not null default ''`;
  await sql`create index if not exists wiki_document_versions_slug_id_idx on wiki_document_versions (slug, id desc)`;
  await sql`
    create table if not exists wiki_public_updates (
      id bigserial primary key,
      slug text not null,
      version_id bigint not null,
      title text not null,
      change_note text not null,
      published_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists wiki_public_updates_published_at_idx on wiki_public_updates (published_at desc)`;
  return true;
}

function rowToVersion(row: Record<string, unknown>): WikiVersion {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    versionName: String(row.version_name),
    title: String(row.title ?? ''),
    changeNote: String(row.change_note ?? ''),
    content: decryptPrivateContent(String(row.content), getWikiPassword()),
    createdAt: new Date(String(row.created_at)).toISOString(),
    createdBy: String(row.created_by),
  };
}

export async function getCurrentWikiDocument(slug: string) {
  const sql = database();
  if (!sql) return null;
  await ensureWikiContentTables();
  const rows = await sql`select slug, title, content, category, visibility, current_version_id, published_version_id, updated_at, published_at from wiki_documents where slug = ${slug} limit 1`;
  if (!rows[0]) return null;
  return {
    slug: String(rows[0].slug),
    title: String(rows[0].title),
    content: decryptPrivateContent(String(rows[0].content), getWikiPassword()),
    category: String(rows[0].category ?? 'Tài nguyên & lịch sử'),
    visibility: rows[0].visibility === 'public' ? 'public' as const : 'internal' as const,
    currentVersionId: rows[0].current_version_id ? Number(rows[0].current_version_id) : null,
    publishedVersionId: rows[0].published_version_id ? Number(rows[0].published_version_id) : null,
    updatedAt: new Date(String(rows[0].updated_at)).toISOString(),
    publishedAt: rows[0].published_at ? new Date(String(rows[0].published_at)).toISOString() : null,
  } satisfies WikiDocument;
}

export async function getWikiVersionHistory(slug: string) {
  const sql = database();
  if (!sql) return [];
  await ensureWikiContentTables();
  const rows = await sql`select id, slug, version_name, title, change_note, content, created_at, created_by from wiki_document_versions where slug = ${slug} order by id desc limit 30`;
  return rows.map((row) => rowToVersion(row));
}

export async function getWikiVersion(slug: string, id: number) {
  const sql = database();
  if (!sql) return null;
  await ensureWikiContentTables();
  const rows = await sql`select id, slug, version_name, title, change_note, content, created_at, created_by from wiki_document_versions where slug = ${slug} and id = ${id} limit 1`;
  return rows[0] ? rowToVersion(rows[0]) : null;
}

function normalizeVisibility(value: unknown): WikiVisibility {
  return value === 'public' ? 'public' : 'internal';
}

function normalizeCategory(value: unknown) {
  const category = String(value ?? '').trim();
  return category.slice(0, 120) || 'Tài nguyên & lịch sử';
}

export async function saveWikiVersion(
  slug: string,
  title: string,
  content: string,
  versionName: string,
  changeNote: string,
  options: { category?: string; visibility?: WikiVisibility; createdBy?: string } = {},
) {
  const sql = database();
  if (!sql) throw new Error('DATABASE_URL is not configured');
  await ensureWikiContentTables();
  const note = normalizeChangeNote(changeNote);
  const category = normalizeCategory(options.category);
  const visibility = normalizeVisibility(options.visibility);
  const createdBy = options.createdBy || 'wiki-internal';
  const encryptedContent = encryptPrivateContent(content, getWikiPassword());
  const inserted = await sql`
    insert into wiki_document_versions (slug, version_name, title, change_note, content, created_by)
    values (${slug}, ${versionName}, ${title}, ${note}, ${encryptedContent}, ${createdBy})
    returning id, slug, version_name, title, change_note, content, created_at, created_by
  `;
  const row = inserted[0];
  await sql`
    insert into wiki_documents (slug, title, content, category, visibility, current_version_id, updated_at)
    values (${slug}, ${title}, ${encryptedContent}, ${category}, ${visibility}, ${row.id}, now())
    on conflict (slug) do update set
      title = excluded.title,
      content = excluded.content,
      category = excluded.category,
      visibility = excluded.visibility,
      current_version_id = excluded.current_version_id,
      updated_at = now()
  `;
  await sql`
    delete from wiki_document_versions
    where slug = ${slug}
      and id not in (select id from wiki_document_versions where slug = ${slug} order by id desc limit 30)
  `;
  return rowToVersion(row);
}

/** Creates the single current Markdown record from a checked-in baseline only once. */
export async function seedWikiDocument(
  slug: string,
  title: string,
  content: string,
  options: { category?: string; visibility?: WikiVisibility } = {},
) {
  const existing = await getCurrentWikiDocument(slug);
  if (existing) return existing;
  const visibility = normalizeVisibility(options.visibility);
  const saved = await saveWikiVersion(slug, title, content, 'Bản nội dung nền tảng', 'Khởi tạo nội dung Markdown hiện hành.', { ...options, visibility });
  if (visibility === 'public') await publishWikiVersion(slug, saved.id);
  return getCurrentWikiDocument(slug);
}

export async function publishWikiVersion(slug: string, versionId: number) {
  const sql = database();
  if (!sql) throw new Error('DATABASE_URL is not configured');
  await ensureWikiContentTables();
  const documentRows = await sql`select slug, visibility from wiki_documents where slug = ${slug} limit 1`;
  if (!documentRows[0]) throw new Error('Wiki document not found');
  const version = await getWikiVersion(slug, versionId);
  if (!version) throw new Error('Wiki version not found');
  const snapshot = publicationSnapshot({ slug, visibility: String(documentRows[0].visibility) }, version);
  await sql`
    update wiki_documents
    set published_version_id = ${snapshot.versionId}, published_at = now()
    where slug = ${slug}
  `;
  const updates = await sql`
    insert into wiki_public_updates (slug, version_id, title, change_note)
    values (${slug}, ${snapshot.versionId}, ${snapshot.title}, ${snapshot.changeNote})
    returning id, published_at
  `;
  return { ...snapshot, updateId: Number(updates[0].id), publishedAt: new Date(String(updates[0].published_at)).toISOString() };
}

export async function getPublishedWikiDocument(slug: string) {
  const sql = database();
  if (!sql) return null;
  await ensureWikiContentTables();
  const rows = await sql`
    select d.slug, d.published_at, v.id, v.title, v.content
    from wiki_documents d
    join wiki_document_versions v on v.id = d.published_version_id
    where d.slug = ${slug} and d.visibility = 'public'
    limit 1
  `;
  if (!rows[0]) return null;
  return {
    slug: String(rows[0].slug),
    title: String(rows[0].title),
    content: decryptPrivateContent(String(rows[0].content), getWikiPassword()),
    publishedAt: rows[0].published_at ? new Date(String(rows[0].published_at)).toISOString() : null,
  };
}

export async function getPublicWikiUpdates(limit = 50): Promise<PublicWikiUpdate[]> {
  const sql = database();
  if (!sql) return [];
  await ensureWikiContentTables();
  const rows = await sql`
    select id, slug, title, change_note, published_at
    from wiki_public_updates
    order by published_at desc, id desc
    limit ${Math.min(Math.max(limit, 1), 100)}
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    changeNote: String(row.change_note),
    publishedAt: new Date(String(row.published_at)).toISOString(),
  }));
}
