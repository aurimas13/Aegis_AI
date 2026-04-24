import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppShell } from '@/components/app-shell';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = 'https://aegis.aurimas.io';
const title = 'Aegis AI — Enterprise AI Governance, Observability & Cost Tracking';
const description =
  'A governance-first AI platform for enterprise IT. Embedded compliance, real-time token cost attribution, and a full audit trail — applied to legacy modernization and ITSM automation. Built by Aurimas Nausedas.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'AI governance',
    'enterprise AI',
    'MLOps',
    'AI cost tracking',
    'legacy modernization',
    'COBOL to Python',
    'ITSM copilot',
    'ITIL v4',
    'fractional AI PM',
    'AI architect',
    'Aurimas Nausedas',
  ],
  authors: [{ name: 'Aurimas Nausedas', url: 'https://aurimas.io' }],
  creator: 'Aurimas Nausedas',
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Aegis AI',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FBF8F2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
