import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Diaconia Agency Banking',
    template: '%s | Diaconia MDI',
  },
  description: 'Secure agency banking portal for Diaconia Microfinance Institution',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0B2447',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
