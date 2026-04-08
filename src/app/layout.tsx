import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropManager - Property Management',
  description: 'Professional property management for Chicago landlords',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
