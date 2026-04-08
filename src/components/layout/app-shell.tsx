'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
