export interface NavItem {
  slug: string;
  label: string;
  file: string;
  icon: string;
  section?: string;
  children?: NavChild[];
  sourceHeading?: string;
}

export interface NavChild {
  slug: string;
  label: string;
  sourceHeading: string;
}

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
      sourceHeading: child.sourceHeading,
    })),
  ]);
}

/** Public wiki sidebar — no auth required */
export const NAV_ITEMS: NavItem[] = [
  { slug: '',                    label: 'Tổng quan',                 file: '00-overview.md',          icon: 'Home2',       section: 'Tổng quan' },
  { slug: '01-product-overview', label: 'Tổng quan sản phẩm',       file: '01-product-overview.md', icon: 'Box1',        section: 'Tổng quan' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Sản phẩm', children: FEATURE_CHILDREN },
  { slug: '09-chatbot-ai',       label: 'Chatbot AI',                file: '09-chatbot-ai.md',       icon: 'MessageText', section: 'Sản phẩm' },
  { slug: '04-security',         label: 'Bảo mật & Quyền riêng tư', file: '04-security.md',       icon: 'Shield',      section: 'Bảo mật & Tác động' },
  { slug: '10-impact-model',     label: 'Mô hình Đóng góp',         file: '10-impact-model.md',     icon: 'Buildings2',  section: 'Bảo mật & Tác động' },
];

/** Internal wiki sidebar — requires login; superset of NAV_ITEMS */
export const NAV_INTERNAL_ITEMS: NavItem[] = [
  // === Tài liệu công khai (mirror of /wiki) ===
  { slug: '',                    label: 'Tổng quan',                 file: '00-overview.md',          icon: 'Home2',       section: 'Tổng quan' },
  { slug: '01-product-overview', label: 'Tổng quan sản phẩm',       file: '01-product-overview.md', icon: 'Box1',        section: 'Tổng quan' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Sản phẩm', children: FEATURE_CHILDREN },
  { slug: '09-chatbot-ai',       label: 'Chatbot AI',                file: '09-chatbot-ai.md',       icon: 'MessageText', section: 'Sản phẩm' },
  { slug: '04-security',         label: 'Bảo mật & Quyền riêng tư', file: '04-security.md',         icon: 'Shield',      section: 'Bảo mật & Tác động' },
  { slug: '10-impact-model',     label: 'Mô hình Đóng góp',         file: '10-impact-model.md',     icon: 'Buildings2',  section: 'Bảo mật & Tác động' },
  // === Tài liệu nội bộ ===
  { slug: '03-architecture',     label: 'Kiến trúc Kỹ thuật',       file: '03-architecture.md',     icon: 'Cpu',        section: 'Nội bộ' },
  { slug: '05-business-model',   label: 'Mô hình Kinh doanh',       file: '05-business-model.md',   icon: 'Chart21',    section: 'Nội bộ' },
  { slug: '06-roadmap',          label: 'Lộ trình',                 file: '06-roadmap.md',          icon: 'Map1',       section: 'Nội bộ' },
  { slug: '07-dev-guide',        label: 'Hướng dẫn Dev',            file: '07-dev-guide.md',        icon: 'Code',       section: 'Nội bộ' },
  { slug: '08-school-admin',     label: 'Admin Nhà trường',         file: '08-school-admin.md',     icon: 'Teacher',    section: 'Nội bộ' },
];
