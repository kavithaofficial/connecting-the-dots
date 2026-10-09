'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { Notification } from '@/types/database';
import { Bell, CheckCheck, CheckCircle2, User, MessageSquare, ArrowRight } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    setNotifications(store.getNotifications());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = () => {
    notifications.forEach((n) => store.markNotificationRead(n.id));
    loadNotifications();
  };

  const handleMarkOne = (id: string) => {
    store.markNotificationRead(id);
    loadNotifications();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
            <Bell className="w-6 h-6 text-gold-600" />
            In-App Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Important updates on connection requests, messages, tasks, and milestones.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead} leftIcon={<CheckCheck className="w-3.5 h-3.5" />}>
          Mark All as Read
        </Button>
      </div>

      <Card>
        <CardBody className="p-0 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  notif.is_read ? 'bg-white' : 'bg-gold-50/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.is_read ? 'bg-slate-100 text-slate-500' : 'bg-gold-100 text-gold-700 font-bold'
                  }`}>
                    {notif.type.includes('connection') ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-navy-950">{notif.title}</h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-gold-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkOne(notif.id)}
                      className="text-xs text-slate-400 hover:text-navy-900"
                      title="Mark as read"
                    >
                      Mark read
                    </button>
                  )}
                  {notif.resource_type === 'connection_request' && (
                    <Link href="/connections">
                      <Button variant="outline" size="sm" className="text-xs">
                        View
                      </Button>
                    </Link>
                  )}
                  {notif.resource_type === 'conversation' && (
                    <Link href="/messages">
                      <Button variant="outline" size="sm" className="text-xs">
                        Chat
                      </Button>
                    </Link>
                  )}
                  {notif.resource_type === 'collaboration' && (
                    <Link href="/collaborations">
                      <Button variant="outline" size="sm" className="text-xs">
                        Open
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
