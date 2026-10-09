'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { store } from '@/lib/data-provider';
import { ConnectionRequest, Connection } from '@/types/database';
import { Users, Check, X, Ban, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ConnectionsPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const currentUserId = store.currentUserId;

  const loadData = () => {
    setRequests(store.getConnectionRequests());
    // Map mutual connections
    const conns = store['connections'].map((c: any) => {
      const partnerId = c.user1_id === currentUserId ? c.user2_id : c.user1_id;
      return {
        ...c,
        partner: store.getProfileById(partnerId),
      };
    });
    setConnections(conns);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = (requestId: string, action: 'accept' | 'decline' | 'cancel') => {
    store.respondConnectionRequest(requestId, action);
    loadData();
  };

  const incomingRequests = requests.filter((r) => r.recipient_id === currentUserId && r.status === 'pending');
  const outgoingRequests = requests.filter((r) => r.sender_id === currentUserId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
          <Users className="w-6 h-6 text-gold-600" />
          Connections & Collaboration Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review incoming requests, track pending outgoing requests, and collaborate with your established network.
        </p>
      </div>

      {/* Incoming Requests */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-navy-950">Incoming Connection Requests</h2>
            <Badge variant="gold" size="sm">{incomingRequests.length} Pending</Badge>
          </div>
          <span className="text-xs text-slate-400">Recipient retains full acceptance control</span>
        </CardHeader>
        <CardBody className="p-5">
          {incomingRequests.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              No pending incoming requests. When other members discover your profile or goal, their requests will appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-navy-950">{req.sender?.display_name}</h4>
                      <p className="text-xs text-slate-500">{req.sender?.headline}</p>
                    </div>
                    {req.goal && (
                      <Badge variant="navy" size="sm">Goal: {req.goal.title}</Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    "{req.message}"
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAction(req.id, 'decline')}
                      leftIcon={<X className="w-3.5 h-3.5" />}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAction(req.id, 'accept')}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Accept & Open Direct Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Established Mutual Connections */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-navy-950">Mutual Connections</h2>
          </div>
          <Badge variant="success" size="sm">{connections.length} Active</Badge>
        </CardHeader>
        <CardBody className="p-5">
          {connections.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No established connections yet"
              description="Browse the Discover page to find collaborators and send purposeful requests."
              actionLabel="Discover People"
              actionHref="/discover"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {connections.map((conn) => (
                <div key={conn.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy-900 text-gold-400 font-bold text-xs flex items-center justify-center">
                      {conn.partner?.display_name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950">{conn.partner?.display_name}</h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{conn.partner?.headline}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link href="/messages" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<MessageSquare className="w-3 h-3" />}>
                        Message
                      </Button>
                    </Link>
                    <Link href={`/profile/${conn.partner?.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Outgoing Requests History */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold text-navy-950">Outgoing Requests History</h2>
        </CardHeader>
        <CardBody className="p-5">
          {outgoingRequests.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No outgoing requests sent yet.</p>
          ) : (
            <div className="space-y-3">
              {outgoingRequests.map((req) => (
                <div key={req.id} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-navy-950">To: {req.recipient?.display_name}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5 truncate max-w-md">"{req.message}"</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={
                        req.status === 'accepted'
                          ? 'success'
                          : req.status === 'pending'
                          ? 'warning'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {req.status}
                    </Badge>

                    {req.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 text-[11px]"
                        onClick={() => handleAction(req.id, 'cancel')}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
