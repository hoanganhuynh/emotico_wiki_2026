import type { Metadata } from 'next';
import './globals.css';
import ConditionalTopNav from '@/components/conditional-top-nav';

export const metadata: Metadata = {
  title: 'Emotico',
  description: 'Emotional wellness platform for Vietnamese schools',
  icons: { icon: '/favicon.ico' },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1A1A2E]">
        <ConditionalTopNav />
        <div className="pt-14 h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
