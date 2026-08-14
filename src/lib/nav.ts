export interface NavItem {
  slug: string;
  label: string;
  file: string;
  icon: string;
}

/** Sidebar navigation — pure data, safe to import in client components */
export const NAV_ITEMS: NavItem[] = [
  { slug: '',                    label: 'Tổng quan',                file: 'README.md',              icon: 'Home2' },
  { slug: '01-product-overview', label: 'Tổng quan sản phẩm',    file: '01-product-overview.md', icon: 'Box1' },
  { slug: '02-features',         label: 'Tính năng',              file: '02-features.md',         icon: 'Star1' },
  { slug: '04-security',         label: 'Bảo mật & Quyền riêng tư', file: '04-security.md',      icon: 'Shield' },
  { slug: '09-chatbot-ai',       label: 'Chatbot AI',             file: '09-chatbot-ai.md',       icon: 'MessageText' },
  { slug: '10-impact-model',     label: 'Mô hình Đóng góp',      file: '10-impact-model.md',     icon: 'Buildings2' },
];
