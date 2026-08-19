import { neon } from '@neondatabase/serverless';
import { ensureWikiAuthTables } from '@/lib/wiki-auth-store';
import { decryptPrivateContent, encryptPrivateContent } from '@/lib/private-content';
import { getWikiPassword } from '@/lib/wiki-auth';

export interface WikiVersion {
  id: number;
  slug: string;
  versionName: string;
  content: string;
  createdAt: string;
  createdBy: string;
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
  await sql`create index if not exists wiki_document_versions_slug_id_idx on wiki_document_versions (slug, id desc)`;
  return true;
}

function rowToVersion(row: Record<string, unknown>): WikiVersion {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    versionName: String(row.version_name),
    content: decryptPrivateContent(String(row.content), getWikiPassword()),
    createdAt: new Date(String(row.created_at)).toISOString(),
    createdBy: String(row.created_by),
  };
}

export async function getCurrentWikiDocument(slug: string) {
  const sql = database();
  if (!sql) return null;
  await ensureWikiContentTables();
  const rows = await sql`select slug, title, content, current_version_id, updated_at from wiki_documents where slug = ${slug} limit 1`;
  if (!rows[0]) return null;
  return {
    slug: String(rows[0].slug),
    title: String(rows[0].title),
    content: decryptPrivateContent(String(rows[0].content), getWikiPassword()),
    currentVersionId: rows[0].current_version_id ? Number(rows[0].current_version_id) : null,
    updatedAt: new Date(String(rows[0].updated_at)).toISOString(),
  };
}

export async function getWikiVersionHistory(slug: string) {
  const sql = database();
  if (!sql) return [];
  await ensureWikiContentTables();
  const rows = await sql`select id, slug, version_name, content, created_at, created_by from wiki_document_versions where slug = ${slug} order by id desc limit 30`;
  return rows.map((row) => rowToVersion(row));
}

export async function getWikiVersion(slug: string, id: number) {
  const sql = database();
  if (!sql) return null;
  await ensureWikiContentTables();
  const rows = await sql`select id, slug, version_name, content, created_at, created_by from wiki_document_versions where slug = ${slug} and id = ${id} limit 1`;
  return rows[0] ? rowToVersion(rows[0]) : null;
}

export async function saveWikiVersion(slug: string, title: string, content: string, versionName: string, createdBy = 'wiki-internal') {
  const sql = database();
  if (!sql) throw new Error('DATABASE_URL is not configured');
  await ensureWikiContentTables();
  const encryptedContent = encryptPrivateContent(content, getWikiPassword());
  const inserted = await sql`
    insert into wiki_document_versions (slug, version_name, content, created_by)
    values (${slug}, ${versionName}, ${encryptedContent}, ${createdBy})
    returning id, slug, version_name, content, created_at, created_by
  `;
  const row = inserted[0];
  await sql`
    insert into wiki_documents (slug, title, content, current_version_id, updated_at)
    values (${slug}, ${title}, ${encryptedContent}, ${row.id}, now())
    on conflict (slug) do update set
      title = excluded.title,
      content = excluded.content,
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
