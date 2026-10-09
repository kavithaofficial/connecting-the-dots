'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { store } from '@/lib/data-provider';
import { Goal, GoalCategory, GoalStatus } from '@/types/database';
import { Target, Plus, Sparkles, Filter, ArrowRight } from 'lucide-react';

export default function GoalsListPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setGoals(store.getGoals());
  }, []);

  const filteredGoals = goals.filter((g) => {
    if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2.5">
            <Target className="w-6 h-6 text-gold-600" />
            My Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Define what you want to achieve, discover missing pieces, and track collaboration progress.
          </p>
        </div>
        <Link href="/goals/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Goal
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-navy-950 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Category:
            </span>
            {['all', 'build_idea', 'task_help', 'first_users', 'custom'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  categoryFilter === cat
                    ? 'bg-navy-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-100 text-navy-950 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals found"
          description={
            categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'No goals match your current filter selections.'
              : 'Create your first goal to initiate missing-piece discovery.'
          }
          actionLabel="Create a Goal"
          actionHref="/goals/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const pieces = store.getMissingPieces(goal.id);
            const unresolvedCount = pieces.filter(
              (p) => p.status === 'suggested' || p.status === 'accepted'
            ).length;

            return (
              <Card key={goal.id} hoverEffect className="flex flex-col justify-between">
                <CardBody className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="navy" size="sm">
                          {goal.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant="slate" size="sm">
                          {goal.collaboration_style.replace('_', ' ')}
                        </Badge>
                      </div>
                      <h2 className="text-lg font-bold text-navy-950 hover:text-gold-600 transition-colors">
                        <Link href={`/goals/${goal.id}`}>{goal.title}</Link>
                      </h2>
                    </div>

                    <Badge
                      variant={goal.status === 'active' ? 'success' : 'slate'}
                      size="sm"
                    >
                      {goal.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Missing Pieces summary pill */}
                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      Missing Pieces:
                    </span>
                    <span className="font-medium text-amber-800">
                      {unresolvedCount > 0
                        ? `${unresolvedCount} need attention`
                        : 'All pieces resolved ✓'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Outcome: <strong className="text-navy-900">{goal.desired_outcome}</strong></span>
                    <span>{goal.timeline || 'Flexible timeline'}</span>
                  </div>
                </CardBody>

                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between">
                  <Link href={`/goals/${goal.id}`} className="text-xs font-semibold text-navy-900 hover:text-gold-600 flex items-center gap-1">
                    <span>Manage Goal & Recommendations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link href={`/goals/${goal.id}/edit`} className="text-xs text-slate-400 hover:text-slate-600">
                    Edit
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
