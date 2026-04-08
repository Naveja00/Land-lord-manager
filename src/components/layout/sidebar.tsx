'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/lib/store';
import {
  Building2,
  LayoutDashboard,
  Layers,
  Home,
  Wrench,
  DollarSign,
  ClipboardList,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const landlordLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/buildings', label: 'Buildings', icon: Building2 },
  { href: '/dashboard/templates', label: 'Unit Templates', icon: Layers },
  { href: '/dashboard/units', label: 'Units', icon: Home },
  { href: '/dashboard/work-orders', label: 'Work Orders', icon: Wrench },
  { href: '/dashboard/accounting', label: 'Accounting', icon: DollarSign },
];

const tenantLinks = [
  { href: '/tenant', label: 'My Unit', icon: Home },
  { href: '/tenant/report', label: 'Report Issue', icon: ClipboardList },
  { href: '/tenant/orders', label: 'My Requests', icon: Wrench },
];

const staffLinks = [
  { href: '/dashboard/work-orders', label: 'Work Orders', icon: Wrench },
];

export function Sidebar() {
  const { currentUser } = useAppState();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links =
    currentUser.role === 'landlord'
      ? landlordLinks
      : currentUser.role === 'tenant'
      ? tenantLinks
      : staffLinks;

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-navy-900 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-700">
        <Building2 className="w-8 h-8 text-white shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">PropManager</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && link.href !== '/tenant' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-navy-700 p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-navy-600 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.full_name}</p>
              <p className="text-xs text-navy-300 capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-navy-700 rounded-full flex items-center justify-center text-white hover:bg-navy-600 shadow-md"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
