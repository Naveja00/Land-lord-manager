import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Twin Property Manager',
  description: 'Deterministic property operations for 3-flats and larger buildings.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl p-4 md:p-8">{children}</main>
      </body>
    </html>
  );
}
