import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NAV_ITEMS } from './nav';

export type { NavItem } from './nav';
export { NAV_ITEMS } from './nav';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface WikiPage {
  slug: string;
  title: string;
  content: string;
}

export function getWikiPage(slug: string): WikiPage | null {
  const nav = NAV_ITEMS.find((n) => n.slug === slug);
  if (!nav) return null;

  const filePath = path.join(CONTENT_DIR, nav.file);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data.title as string | undefined) ?? nav.label,
    content,
  };
}
