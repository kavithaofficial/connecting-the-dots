'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User, Compass, CheckCircle2 } from 'lucide-react';
import { Profile } from '@/types/database';

interface AppHeaderProps {
  userProfile?: Profile | null;
  unreadCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  userProfile,
  unreadCount = 0,
}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      // Clear cookie or call signOut action
      document.cookie = 'sb-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const displayName = userProfile?.display_name || 'Elena Rostova';
  const headline = userProfile?.headline || 'Active Member';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Quick Search Shortcut */}
        <Link
          href="/discover"
          className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg border border-slate-200/70 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>Discover people, skills, or offers...</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Icon with Badge */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-navy-950 hover:bg-slate-50 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500 ring-2 ring-white" />
          )}
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-navy-900 text-gold-400 font-bold text-xs flex items-center justify-center ring-2 ring-slate-100">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-navy-950 leading-none">{displayName}</div>
              <div className="text-[11px] text-slate-400 truncate max-w-[140px] mt-0.5">{headline}</div>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-navy-950">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{headline}</p>
              </div>

              <Link
                href={`/profile/${userProfile?.id || 'me'}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Public Profile</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </Link>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
