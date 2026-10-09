'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { store } from '@/lib/data-provider';
import { Collaboration } from '@/types/database';
import { FolderGit2, Plus, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CollaborationsListPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);

  useEffect(() => {
    setCollaborations(store.getCollaborations());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-gold-600" />
            Collaboration Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Turn conversations into outcomes. Manage shared tasks, track milestones, and post progress updates.
          </p>
        </div>
      </div>

      {collaborations.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No collaboration workspaces yet"
          description="Collaborations are established after mutual connection requests are accepted."
          actionLabel="View Connections"
          actionHref="/connections"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collaborations.map((c) => {
            const tasks = store.getTasks(c.id);
            const doneTasks = tasks.filter((t) => t.status === 'done').length;
            const milestones = store.getMilestones(c.id);

            return (
              <Card key={c.id} hoverEffect className="flex flex-col justify-between">
                <CardBody className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="navy" size="sm">Active Workspace</Badge>
                      <h2 className="text-lg font-bold text-navy-950 mt-1">
                        <Link href={`/collaborations/${c.id}`}>{c.title}</Link>
                      </h2>
                    </div>
                    <Badge variant={c.status === 'active' ? 'success' : 'slate'} size="sm">
                      {c.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {c.description || 'Sprint workspace for milestone delivery.'}
                  </p>

                  {/* Task progress stats */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Tasks Progress</span>
                      <strong className="text-navy-950">{doneTasks} of {tasks.length} completed</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Milestones</span>
                      <strong className="text-navy-950">{milestones.length} active</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Target: {c.target_date || 'Ongoing'}
                    </span>
                    <span className="text-navy-900 font-medium">Goal-linked</span>
                  </div>
                </CardBody>

                <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between">
                  <Link href={`/collaborations/${c.id}`} className="text-xs font-semibold text-navy-900 hover:text-gold-600 flex items-center gap-1">
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
