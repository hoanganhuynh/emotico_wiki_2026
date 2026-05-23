export interface NavItem {
  slug: string;
  label: string;
  file: string;
}

/** Sidebar navigation — pure data, safe to import in client components */
export const NAV_ITEMS: NavItem[] = [
  { slug: '',                    label: 'Overview',           file: 'README.md' },
  { slug: '01-product-overview', label: 'Product Overview',   file: '01-product-overview.md' },
  { slug: '02-features',         label: 'Features',           file: '02-features.md' },
  { slug: '03-architecture',     label: 'Architecture',       file: '03-architecture.md' },
  { slug: '04-security',         label: 'Security & Privacy', file: '04-security.md' },
  { slug: '05-business-model',   label: 'Business Model',     file: '05-business-model.md' },
  { slug: '06-roadmap',          label: 'Roadmap',            file: '06-roadmap.md' },
  { slug: '07-dev-guide',        label: 'Developer Guide',    file: '07-dev-guide.md' },
];
