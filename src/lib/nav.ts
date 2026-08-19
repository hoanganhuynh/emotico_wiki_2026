export interface NavItem {
  slug: string;
  label: string;
  file: string;
  icon: string;
  section?: string;
}

/** Public wiki sidebar — no auth required */
export const NAV_ITEMS: NavItem[] = [
  { slug: '',                    label: 'Tổng quan',                 file: 'README.md',              icon: 'Home2',       section: 'Tổng quan' },
  { slug: '01-product-overview', label: 'Tổng quan sản phẩm',       file: '01-product-overview.md', icon: 'Box1',        section: 'Tổng quan' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Sản phẩm' },
  { slug: '09-chatbot-ai',       label: 'Chatbot AI',                file: '09-chatbot-ai.md',       icon: 'MessageText', section: 'Sản phẩm' },
  { slug: '04-security',         label: 'Bảo mật & Quyền riêng tư', file: '04-security.md',       icon: 'Shield',      section: 'Bảo mật & Tác động' },
  { slug: '10-impact-model',     label: 'Mô hình Đóng góp',         file: '10-impact-model.md',     icon: 'Buildings2',  section: 'Bảo mật & Tác động' },
];

/** Internal wiki sidebar — requires login; superset of NAV_ITEMS */
export const NAV_INTERNAL_ITEMS: NavItem[] = [
  // === Tài liệu công khai (mirror of /wiki) ===
  { slug: '',                    label: 'Tổng quan',                 file: 'README.md',              icon: 'Home2',       section: 'Tổng quan' },
  { slug: '01-product-overview', label: 'Tổng quan sản phẩm',       file: '01-product-overview.md', icon: 'Box1',        section: 'Tổng quan' },
  { slug: '02-features',         label: 'Tính năng',                 file: '02-features.md',         icon: 'Star1',       section: 'Sản phẩm' },
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
