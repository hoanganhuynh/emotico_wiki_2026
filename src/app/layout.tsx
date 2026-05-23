import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/top-nav';

export const metadata: Metadata = {
  title: 'Emotico',
  description: 'Emotional wellness platform for Vietnamese schools',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1A1A2E]">
        <TopNav />
        {/* Push content below fixed nav */}
        <div className="pt-14 h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
