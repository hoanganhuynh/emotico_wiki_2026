import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NAV_ITEMS, flattenNavItems } from './nav';

export type { NavItem } from './nav';
export { NAV_ITEMS } from './nav';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface WikiPage {
  slug: string;
  title: string;
  content: string;
}

function extractSection(content: string, heading: string): string {
  const start = content.indexOf(`\n${heading}\n`);
  if (start < 0) return content;
  const sectionStart = start + 1;
  const rest = content.slice(sectionStart + heading.length + 1);
  const nextSection = rest.search(/\n##\s+/);
  return nextSection < 0 ? content.slice(sectionStart) : content.slice(sectionStart, sectionStart + heading.length + 1 + nextSection);
}

function featureOverview(label: string, children: { slug: string; label: string }[]): string {
  return `# ${label}\n\nMỗi tính năng được trình bày trên một trang riêng để dễ theo dõi và cập nhật. Chọn một nội dung bên dưới:\n\n${children.map((child) => `* [${child.label}](./${child.slug})`).join('\n')}`;
}

export function getWikiPage(slug: string): WikiPage | null {
  const nav = flattenNavItems(NAV_ITEMS).find((n) => n.slug === slug);
  if (!nav) return null;

  const filePath = path.join(CONTENT_DIR, nav.file);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const pageContent = nav.sourceHeading
    ? extractSection(content, nav.sourceHeading)
    : nav.children
      ? featureOverview(nav.label, nav.children)
      : content;
  return {
    slug,
    title: (data.title as string | undefined) ?? nav.label,
    content: pageContent,
  };
}
