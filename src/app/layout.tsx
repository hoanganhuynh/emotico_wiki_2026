import type { Metadata, Viewport } from 'next';
import './globals.css';
import ConditionalTopNav from '@/components/conditional-top-nav';

export const metadata: Metadata = {
  title: 'Emotico',
  description: 'Emotional wellness platform for Vietnamese schools',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-white text-[#1A1A2E]">
        <ConditionalTopNav />
        <div className="h-screen flex flex-col pt-16 md:pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
