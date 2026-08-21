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
  { slug: 'feature-fun-quiz', label: 'Đoán vui', sourceHeading: '## 5. Đoán vui — Những bài trắc nghiệm chỉ để giải trí' },
  { slug: 'feature-cbt', label: 'Bài tập CBT & Bí kíp Tâm lý', sourceHeading: '## 6. Bài tập CBT & Bí kíp Tâm lý' },
  { slug: 'feature-support', label: 'Hồ sơ & Danh bạ Hỗ trợ', sourceHeading: '## 7. Hồ sơ & Danh bạ Hỗ trợ' },
  { slug: 'feature-dashboard', label: 'Báo cáo & Dashboard', sourceHeading: '## 8. Báo cáo & Dashboard' },
  { slug: 'feature-chatbot', label: 'Web Chatbot', sourceHeading: '## 9. Web Chatbot — Giáo viên & Phụ huynh' },
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
  { slug: '',                    label: 'Bắt đầu với Emotico',      file: '00-overview.md',          icon: 'Home2',       section: 'Bắt đầu', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '01-product-overview', label: 'Emotico dành cho ai?',      file: '01-product-overview.md', icon: 'Box1',        section: 'Bắt đầu', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Tính năng', category: 'Sản phẩm & nội dung', visibility: 'public', children: FEATURE_CHILDREN },
  { slug: '09-chatbot-ai',       label: 'Chatbot cho người lớn',     file: '09-chatbot-ai.md',       icon: 'MessageText', section: 'Tính năng', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '04-security',         label: 'An toàn & quyền riêng tư', file: '04-security.md',       icon: 'Shield',      section: 'An toàn & bằng chứng', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  { slug: '10-impact-model',     label: 'Cơ sở khoa học & pháp lý', file: '10-impact-model.md',     icon: 'Buildings2',  section: 'An toàn & bằng chứng', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  { slug: 'updates',             label: 'Phiên bản cập nhật',       file: '11-updates.md',          icon: 'Clock',       section: 'An toàn & bằng chứng', category: 'Tài nguyên & lịch sử', visibility: 'public' },
];

/** Internal wiki sidebar — requires login; superset of NAV_ITEMS */
export const NAV_INTERNAL_ITEMS: NavItem[] = [
  // === Tài liệu công khai (mirror of /wiki) ===
  { slug: '',                    label: 'Bắt đầu với Emotico',      file: '00-overview.md',          icon: 'Home2',       section: 'Sản phẩm & nội dung', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '01-product-overview', label: 'Emotico dành cho ai?',      file: '01-product-overview.md', icon: 'Box1',        section: 'Sản phẩm & nội dung', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Sản phẩm & nội dung', category: 'Sản phẩm & nội dung', visibility: 'public', children: FEATURE_CHILDREN },
  { slug: '09-chatbot-ai',       label: 'Chatbot cho người lớn',     file: '09-chatbot-ai.md',       icon: 'MessageText', section: 'Sản phẩm & nội dung', category: 'Sản phẩm & nội dung', visibility: 'public' },
  { slug: '04-security',         label: 'An toàn & quyền riêng tư', file: '04-security.md',         icon: 'Shield',      section: 'Nghiên cứu, pháp lý & an toàn', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  { slug: '10-impact-model',     label: 'Cơ sở khoa học & pháp lý', file: '10-impact-model.md',     icon: 'Buildings2',  section: 'Nghiên cứu, pháp lý & an toàn', category: 'Nghiên cứu, pháp lý & an toàn', visibility: 'public' },
  // === Tài liệu nội bộ ===
  { slug: '03-architecture',     label: 'Kiến trúc kỹ thuật',       file: '03-architecture.md',     icon: 'Cpu',        section: 'Phát triển sản phẩm', category: 'Phát triển sản phẩm', visibility: 'internal' },
  { slug: '05-business-model',   label: 'Mô hình kinh doanh',       file: '05-business-model.md',   icon: 'Chart21',    section: 'Kinh doanh', category: 'Kinh doanh', visibility: 'internal' },
  { slug: '06-roadmap',          label: 'Lộ trình sản phẩm',        file: '06-roadmap.md',          icon: 'Map1',       section: 'Phát triển sản phẩm', category: 'Phát triển sản phẩm', visibility: 'internal' },
  { slug: '07-dev-guide',        label: 'Hướng dẫn phát triển',     file: '07-dev-guide.md',        icon: 'Code',       section: 'Phát triển sản phẩm', category: 'Phát triển sản phẩm', visibility: 'internal' },
  { slug: '08-school-admin',     label: 'Vận hành nhà trường',      file: '08-school-admin.md',     icon: 'Teacher',    section: 'Vận hành', category: 'Vận hành', visibility: 'internal' },
  { slug: '11-content-standards', label: 'Chuẩn nội dung & tài nguyên', file: '11-content-standards.md', icon: 'FolderOpen', section: 'Tài nguyên & lịch sử', category: 'Tài nguyên & lịch sử', visibility: 'internal' },
];
