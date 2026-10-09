'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { store } from '@/lib/data-provider';
import { matchProfileToGoal } from '@/lib/engine/matching';
import {
  Target,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  Plus,
  Briefcase,
  FolderGit2,
} from 'lucide-react';
import { Goal, GoalMissingPiece, ConnectionRequest, Collaboration, Task } from '@/types/database';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(store.getCurrentUser());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [missingPieces, setMissingPieces] = useState<GoalMissingPiece[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const user = store.getCurrentUser();
    setCurrentUser(user);

    const userGoals = store.getGoals(user.id);
    setGoals(userGoals);

    // Get all unresolved missing pieces for user's goals
    const allPieces: GoalMissingPiece[] = [];
    userGoals.forEach((g) => {
      const pieces = store.getMissingPieces(g.id);
      allPieces.push(...pieces.filter((p) => p.status === 'suggested' || p.status === 'accepted'));
    });
    setMissingPieces(allPieces);

    // Connection requests
    const reqs = store.getConnectionRequests();
    setPendingRequests(reqs.filter((r) => r.recipient_id === user.id && r.status === 'pending'));

    // Collaborations & tasks
    const collabs = store.getCollaborations();
    setCollaborations(collabs);
    if (collabs.length > 0) {
      setTasks(store.getTasks(collabs[0].id));
    }

    // Recommendations for first active goal
    if (userGoals.length > 0) {
      const primaryGoal = userGoals[0];
      const otherProfiles = store.getProfiles().filter((p) => p.id !== user.id);
      const matches = otherProfiles
        .map((p) => matchProfileToGoal(primaryGoal, p, allPieces))
        .filter(Boolean)
        .slice(0, 2);
      setRecommendations(matches);
    }
  }, []);

  const handleResolvePiece = (pieceId: string) => {
    store.updateMissingPiece(pieceId, 'resolve');
    setMissingPieces((prev) => prev.filter((p) => p.id !== pieceId));
  };

  const handleTaskToggle = (taskId: string, currentStatus: Task['status']) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    store.updateTaskStatus(taskId, nextStatus);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner: Welcome & Goal-Driven Prompt */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-navy-800 text-gold-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Action-Oriented Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.display_name}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            What is your next priority today? Review unresolved missing pieces, respond to connection requests, or collaborate on your active milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/goals/new">
            <Button variant="gold" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Create New Goal
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant="outline" size="md" className="bg-transparent text-white border-slate-700 hover:bg-navy-800">
              Discover People & Offers
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Core Journey Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Goals Section */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gold-600" />
                <h2 className="text-base font-bold text-navy-950">Active Goals</h2>
              </div>
              <Link href="/goals" className="text-xs font-semibold text-gold-600 hover:text-gold-700">
                View all ({goals.length})
              </Link>
            </CardHeader>
            <CardBody className="p-5">
              {goals.length === 0 ? (
                <EmptyState
                  icon={Target}
                  title="No active goals yet"
                  description="Define your first goal to let the Missing-Piece engine suggest critical skills and collaborators."
                  actionLabel="Define Your First Goal"
                  actionHref="/goals/new"
                />
              ) : (
                <div className="space-y-4">
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-navy-300 transition-all bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="navy" size="sm">{g.category.replace('_', ' ')}</Badge>
                            <Badge variant="slate" size="sm">{g.collaboration_style.replace('_', ' ')}</Badge>
                          </div>
                          <Link href={`/goals/${g.id}`} className="text-base font-bold text-navy-950 hover:text-gold-600 transition-colors">
                            {g.title}
                          </Link>
                        </div>
                        <Link href={`/goals/${g.id}`}>
                          <Button variant="outline" size="sm">
                            Inspect Goal
                          </Button>
                        </Link>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {g.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <span>Outcome: <strong className="text-navy-900">{g.desired_outcome}</strong></span>
                        <span>{g.timeline || 'Ongoing'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Missing Pieces Unresolved */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-600" />
                <h2 className="text-base font-bold text-navy-950">Identified Missing Pieces to Solve</h2>
              </div>
              <Badge variant="warning" size="sm">{missingPieces.length} Needs Attention</Badge>
            </CardHeader>
            <CardBody className="p-5">
              {missingPieces.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-500">
                  All identified missing pieces are currently resolved!
                </div>
              ) : (
                <div className="space-y-3">
                  {missingPieces.map((piece) => (
                    <div
                      key={piece.id}
                      className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-navy-950">{piece.missing_skill_or_resource}</span>
                          <span className="text-[11px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            {Math.round(piece.confidence_score * 100)}% Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{piece.reason}</p>
                        <p className="text-xs text-gold-800 font-medium">Next action: {piece.suggested_next_action}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href="/discover">
                          <Button variant="outline" size="sm">
                            Find Match
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResolvePiece(piece.id)}
                          className="text-emerald-700 hover:bg-emerald-50"
                        >
                          Mark Resolved ✓
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Outstanding Collaboration Tasks */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-navy-800" />
                <h2 className="text-base font-bold text-navy-950">Active Collaboration Tasks</h2>
              </div>
              <Link href="/collaborations" className="text-xs font-semibold text-gold-600 hover:text-gold-700">
                Workspaces
              </Link>
            </CardHeader>
            <CardBody className="p-5">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No outstanding tasks right now.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskToggle(task.id, task.status)}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        task.status === 'done'
                          ? 'bg-slate-50 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-navy-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                          task.status === 'done' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300'
                        }`}>
                          {task.status === 'done' && '✓'}
                        </div>
                        <span className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-navy-950'}`}>
                          {task.title}
                        </span>
                      </div>
                      <Badge variant={task.priority === 'high' ? 'danger' : 'slate'} size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Connection Requests, Recommendations & Quick Shortcuts */}
        <div className="space-y-8">
          {/* Pending Connection Requests */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-navy-800" />
                <h2 className="text-base font-bold text-navy-950">Incoming Requests</h2>
              </div>
              <Badge variant="gold" size="sm">{pendingRequests.length} Pending</Badge>
            </CardHeader>
            <CardBody className="p-5 space-y-3">
              {pendingRequests.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  No pending incoming connection requests.
                </p>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-950">{req.sender?.display_name}</span>
                      <span className="text-[10px] text-slate-400">Just now</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">"{req.message}"</p>
                    <div className="pt-2 flex items-center gap-2">
                      <Link href="/connections" className="w-full">
                        <Button variant="primary" size="sm" className="w-full">
                          Review Request
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          {/* Explainable Recommendations for Your Goal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold-600" />
                <h2 className="text-base font-bold text-navy-950">Recommended for Your Goal</h2>
              </div>
            </CardHeader>
            <CardBody className="p-5 space-y-4">
              {recommendations.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  Add more details to your goal to surface targeted matches.
                </p>
              ) : (
                recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-950">{rec.item.display_name}</span>
                      <span className="text-xs font-mono font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                        {rec.score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{rec.explanation}</p>
                    <div className="pt-1">
                      <Link href={`/profile/${rec.item.id}`}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          View Profile & Connect
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          {/* Quick Action Shortcuts */}
          <Card className="bg-navy-950 text-white border-navy-900">
            <CardBody className="p-5 space-y-4">
              <h3 className="text-sm font-bold text-gold-400">Quick Shortcuts</h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/offers/new"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gold-500" />
                    Publish an Offer / Service
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gold-500" />
                    Direct Messages
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-500" />
                    Profile & Discoverability
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
