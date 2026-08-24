export interface NavItem {
  slug: string;
  label: string;
  file: string;
  icon: string;
  section?: string;
  children?: NavChild[];
  sourceHeading?: string;
  category?: string;
  visibility?: 'public' | 'internal';
}

export interface NavChild {
  slug: string;
  label: string;
  sourceHeading: string;
}

export const INTERNAL_CATEGORIES = [
  'Kinh doanh',
  'Vận hành',
  'Sản phẩm & nội dung',
  'Phát triển sản phẩm',
  'Nghiên cứu, pháp lý & an toàn',
  'Tài nguyên & lịch sử',
] as const;

const FEATURE_CHILDREN: NavChild[] = [
  { slug: 'feature-check-in', label: 'Check-in Cảm xúc', sourceHeading: '## 1. Check-in Cảm xúc' },
  { slug: 'feature-history', label: 'Lịch sử & Báo cáo Cảm xúc', sourceHeading: '## 2. Lịch sử & Báo cáo Cảm xúc' },
  { slug: 'feature-dictionary', label: 'Từ điển Cảm xúc', sourceHeading: '## 3. Từ điển Cảm xúc' },
  { slug: 'feature-wellness', label: 'Wellness Quiz', sourceHeading: '## 4. Wellness Quiz — Khám phá sức khỏe toàn diện' },
  { slug: 'feature-fun-quiz', label: 'Đoán vui', sourceHeading: '## 5. Đoán vui — Khám phá những góc nhỏ của bản thân' },
  { slug: 'feature-cbt', label: 'Bài tập CBT & Bí kíp Tâm lý', sourceHeading: '## 6. Bài tập CBT & Bí kíp Tâm lý' },
  { slug: 'feature-support', label: 'Hồ sơ & Danh bạ Hỗ trợ', sourceHeading: '## 7. Hồ sơ & Danh bạ Hỗ trợ' },
  { slug: 'feature-dashboard', label: 'Báo cáo & Dashboard', sourceHeading: '## 8. Báo cáo & Dashboard' },
  { slug: 'feature-chatbot', label: 'Web Chatbot', sourceHeading: '## 9. Web Chatbot — Giáo viên & Phụ huynh' },
  { slug: 'feature-encyclopedia', label: 'Bách khoa Tâm lý học', sourceHeading: '## 10. Bách khoa Tâm lý học' },
];

export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ?? []).map((child) => ({
      slug: child.slug,
      label: child.label,
      file: item.file,
      icon: item.icon,
      section: item.section,
      category: item.category,
      visibility: item.visibility,
      sourceHeading: child.sourceHeading,
    })),
  ]);
}

/** Public wiki sidebar — no auth required */
export const NAV_ITEMS: NavItem[] = [
  { slug: '',                    label: 'Bắt đầu',                  file: '00-overview.md',          icon: 'Home2',       section: 'Khám phá', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '01-product-overview', label: 'Dành cho ai?',              file: '01-product-overview.md', icon: 'Box1',        section: 'Khám phá', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Khám phá', category: 'Sản phẩm & nội dung', visibility: 'public', children: FEATURE_CHILDREN },
  { slug: '09-chatbot-ai',       label: 'Chatbot',                   file: '09-chatbot-ai.md',       icon: 'MessageText', section: 'Khám phá', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '04-security',         label: 'An toàn & riêng tư',       file: '04-security.md',         icon: 'Shield',      section: 'Tin cậy', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  { slug: '10-impact-model',     label: 'Cơ sở khoa học',           file: '10-impact-model.md',     icon: 'Buildings2',  section: 'Tin cậy', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  { slug: 'updates',             label: 'Cập nhật',                 file: '11-updates.md',          icon: 'Clock',       section: 'Tin cậy', category: 'Tài nguyên & lịch sử', visibility: 'public' },
];

/** Internal wiki sidebar — requires login; superset of NAV_ITEMS */
export const NAV_INTERNAL_ITEMS: NavItem[] = [
  // === Tài liệu công khai (mirror of /wiki) ===
  { slug: '',                    label: 'Bắt đầu',                  file: '00-overview.md',          icon: 'Home2',       section: 'Wiki public', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '01-product-overview', label: 'Dành cho ai?',              file: '01-product-overview.md', icon: 'Box1',        section: 'Wiki public', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Wiki public', category: 'Sản phẩm & nội dung', visibility: 'public', children: FEATURE_CHILDREN },
  { slug: '09-chatbot-ai',       label: 'Chatbot',                   file: '09-chatbot-ai.md',       icon: 'MessageText', section: 'Wiki public', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '04-security',         label: 'An toàn & riêng tư',       file: '04-security.md',         icon: 'Shield',      section: 'Wiki public', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  { slug: '10-impact-model',     label: 'Cơ sở khoa học',           file: '10-impact-model.md',     icon: 'Buildings2',  section: 'Wiki public', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  // === Tài liệu nội bộ ===
  { slug: '08-school-admin',     label: 'Nhà trường',               file: '08-school-admin.md',     icon: 'Teacher',    section: 'Vận hành & phát triển', category: 'Vận hành', visibility: 'internal' },
  { slug: '03-architecture',     label: 'Kiến trúc',                file: '03-architecture.md',     icon: 'Cpu',        section: 'Vận hành & phát triển', category: 'Phát triển sản phẩm', visibility: 'internal' },
  { slug: '06-roadmap',          label: 'Lộ trình',                 file: '06-roadmap.md',          icon: 'Map1',       section: 'Vận hành & phát triển', category: 'Phát triển sản phẩm', visibility: 'internal' },
  { slug: '07-dev-guide',        label: 'Hướng dẫn dev',            file: '07-dev-guide.md',        icon: 'Code',       section: 'Vận hành & phát triển', category: 'Phát triển sản phẩm', visibility: 'internal' },
  { slug: '05-business-model',   label: 'Kinh doanh',               file: '05-business-model.md',   icon: 'Chart21',    section: 'Kế hoạch & tài nguyên', category: 'Kinh doanh', visibility: 'internal' },
  { slug: '11-content-standards', label: 'Chuẩn nội dung',          file: '11-content-standards.md', icon: 'FolderOpen', section: 'Kế hoạch & tài nguyên', category: 'Tài nguyên & lịch sử', visibility: 'internal' },
  { slug: '12-bach-khoa-editorial', label: 'Bách khoa — Kiến trúc nội dung', file: '12-bach-khoa-editorial.md', icon: 'Book1', section: 'Vận hành & phát triển', category: 'Sản phẩm & nội dung', visibility: 'internal' },
];
