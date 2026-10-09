'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { store } from '@/lib/data-provider';
import { Profile } from '@/types/database';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    const notifs = store.getNotifications();
    setUnreadCount(notifs.filter((n) => !n.is_read).length);
  }, []);

  return (
    <div className="min-h-screen flex bg-neutral-warm">
      <AppSidebar
        isAdmin={currentUser?.role === 'admin'}
        unreadCount={unreadCount}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          userProfile={currentUser}
          unreadCount={unreadCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
