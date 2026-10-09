'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { store } from '@/lib/data-provider';
import { Goal, GoalCategory, CollaborationStyle, GoalVisibility, GoalStatus } from '@/types/database';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function EditGoalPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params?.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [currentProgress, setCurrentProgress] = useState('');
  const [collaborationStyle, setCollaborationStyle] = useState<CollaborationStyle>('skill_exchange');
  const [status, setStatus] = useState<GoalStatus>('active');
  const [timeline, setTimeline] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!goalId) return;
    const g = store.getGoalById(goalId);
    if (!g) {
      router.push('/goals');
      return;
    }
    setTitle(g.title);
    setDescription(g.description);
    setDesiredOutcome(g.desired_outcome);
    setCurrentProgress(g.current_progress || '');
    setCollaborationStyle(g.collaboration_style);
    setStatus(g.status);
    setTimeline(g.timeline || '');
  }, [goalId, router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    try {
      store.updateGoal(goalId, {
        title,
        description,
        desired_outcome: desiredOutcome,
        current_progress: currentProgress || null,
        collaboration_style: collaborationStyle,
        status,
        timeline: timeline || null,
      });

      router.push(`/goals/${goalId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href={`/goals/${goalId}`} className="text-xs text-slate-500 hover:text-navy-950 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Goal
      </Link>

      <h1 className="text-2xl font-extrabold text-navy-950">Edit Goal</h1>

      <Card>
        <CardBody className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">Desired Outcome</label>
              <input
                type="text"
                required
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GoalStatus)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">Timeline</label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <Link href={`/goals/${goalId}`}>
                <Button variant="ghost" type="button">Cancel</Button>
              </Link>
              <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
