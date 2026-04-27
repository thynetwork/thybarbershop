import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { config } from '@/lib/config';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: `${config.serviceName} — ${config.tagline}`,
  description: `Book your trusted ${config.providerLabel.toLowerCase()} directly. Private, direct, no commission.`,
  keywords: [config.serviceName, config.providerLabel, 'booking', 'private', 'direct'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
