'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  LayoutDashboard,
  Target,
  Compass,
  Briefcase,
  Users,
  MessageSquare,
  FolderGit2,
  Bell,
  Settings,
  ShieldAlert,
} from 'lucide-react';

interface AppSidebarProps {
  isAdmin?: boolean;
  unreadCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isAdmin = false,
  unreadCount = 0,
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Goals', href: '/goals', icon: Target },
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'Offers & Services', href: '/offers', icon: Briefcase },
    { label: 'Connections', href: '/connections', icon: Users },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Collaborations', href: '/collaborations', icon: FolderGit2 },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <BrandLogo size="sm" />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-gold-500 text-navy-950' : 'bg-gold-100 text-gold-800'
                }`}>
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/admin')
                  ? 'bg-rose-900 text-white'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Admin Moderation</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Quick Action footer */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/goals/new"
          className="flex items-center justify-center w-full py-2.5 px-4 bg-navy-50 text-navy-900 hover:bg-navy-100 border border-navy-200 text-xs font-semibold rounded-lg transition-colors"
        >
          + Create New Goal
        </Link>
      </div>
    </aside>
  );
};
