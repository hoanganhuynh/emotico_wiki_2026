export interface NavItem {
  slug: string;
  label: string;
  file: string;
  icon: string;
}

/** Public wiki sidebar — no auth required */
export const NAV_ITEMS: NavItem[] = [
  { slug: '',                    label: 'Tổng quan',                 file: 'README.md',              icon: 'Home2' },
  { slug: '01-product-overview', label: 'Tổng quan sản phẩm',     file: '01-product-overview.md', icon: 'Box1' },
  { slug: '02-features',         label: 'Tính năng',               file: '02-features.md',         icon: 'Star1' },
  { slug: '04-security',         label: 'Bảo mật & Quyền riêng tư', file: '04-security.md',       icon: 'Shield' },
  { slug: '09-chatbot-ai',       label: 'Chatbot AI',              file: '09-chatbot-ai.md',       icon: 'MessageText' },
  { slug: '10-impact-model',     label: 'Mô hình Đóng góp',       file: '10-impact-model.md',     icon: 'Buildings2' },
];

/** Internal wiki sidebar — requires login */
export const NAV_INTERNAL_ITEMS: NavItem[] = [
  { slug: '',                label: 'Tổng quan Nội bộ',      file: 'README.md',              icon: 'Home2' },
  { slug: '03-architecture', label: 'Kiến trúc Kỹ thuật',   file: '03-architecture.md',     icon: 'Cpu' },
  { slug: '05-business-model', label: 'Mô hình Kinh doanh', file: '05-business-model.md',   icon: 'Chart21' },
  { slug: '06-roadmap',      label: 'Lộ trình',              file: '06-roadmap.md',           icon: 'Map1' },
  { slug: '07-dev-guide',    label: 'Hướng dẫn Dev',        file: '07-dev-guide.md',         icon: 'Code' },
  { slug: '08-school-admin', label: 'Admin Nhà trường',     file: '08-school-admin.md',      icon: 'Buildings2' },
];
