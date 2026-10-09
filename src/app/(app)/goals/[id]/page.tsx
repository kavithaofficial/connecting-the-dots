'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { matchProfileToGoal, matchOfferToGoal } from '@/lib/engine/matching';
import { Goal, GoalMissingPiece, GoalStatus } from '@/types/database';
import {
  Target,
  Sparkles,
  Users,
  Compass,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Plus,
  Clock,
  Briefcase,
  ExternalLink,
  Pause,
  Play,
  Archive,
} from 'lucide-react';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params?.id as string;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [missingPieces, setMissingPieces] = useState<GoalMissingPiece[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [customAction, setCustomAction] = useState('');

  useEffect(() => {
    if (!goalId) return;
    const g = store.getGoalById(goalId);
    if (!g) {
      router.push('/goals');
      return;
    }
    setGoal(g);

    const pieces = store.getMissingPieces(goalId);
    setMissingPieces(pieces);

    // Compute recommendations for this specific goal
    const otherProfiles = store.getProfiles().filter((p) => p.id !== g.user_id);
    const profileMatches = otherProfiles
      .map((p) => matchProfileToGoal(g, p, pieces))
      .filter(Boolean);

    const otherOffers = store.getOffers().filter((o) => o.user_id !== g.user_id);
    const offerMatches = otherOffers
      .map((o) => matchOfferToGoal(g, o, pieces))
      .filter(Boolean);

    setRecommendations([...profileMatches, ...offerMatches]);
  }, [goalId, router]);

  if (!goal) {
    return <div className="p-8 text-center text-slate-500">Loading goal details...</div>;
  }

  const handlePieceAction = (pieceId: string, action: 'accept' | 'dismiss' | 'resolve') => {
    store.updateMissingPiece(pieceId, action);
    setMissingPieces(store.getMissingPieces(goalId));
  };

  const handleAddCustomPiece = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkill.trim() || !customReason.trim()) return;

    store.addCustomMissingPiece(goalId, {
      missing_skill_or_resource: customSkill,
      reason: customReason,
      suggested_next_action: customAction || 'Find a specialist on Discover page',
      related_tags: [customSkill],
    });

    setMissingPieces(store.getMissingPieces(goalId));
    setCustomSkill('');
    setCustomReason('');
    setCustomAction('');
    setShowAddCustom(false);
  };

  const handleStatusChange = (status: GoalStatus) => {
    const updated = store.updateGoal(goalId, { status });
    setGoal(updated);
  };

  const activePieces = missingPieces.filter((p) => p.status !== 'dismissed');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/goals" className="text-xs text-slate-500 hover:text-navy-950 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Goals
        </Link>
        <div className="flex items-center gap-2">
          {goal.status === 'active' ? (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('paused')} leftIcon={<Pause className="w-3.5 h-3.5" />}>
              Pause Goal
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('active')} leftIcon={<Play className="w-3.5 h-3.5" />}>
              Resume Goal
            </Button>
          )}
          {goal.status !== 'completed' && (
            <Button variant="secondary" size="sm" onClick={() => handleStatusChange('completed')} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Mark Completed
            </Button>
          )}
          <Link href={`/goals/${goal.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Goal Header Card */}
      <Card className="shadow-sm border-slate-200">
        <CardBody className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="navy" size="md">{goal.category.replace('_', ' ')}</Badge>
            <Badge variant="gold" size="md">{goal.collaboration_style.replace('_', ' ')}</Badge>
            <Badge variant={goal.status === 'active' ? 'success' : 'slate'} size="md">
              Status: {goal.status}
            </Badge>
            <Badge variant="outline" size="md">Visibility: {goal.visibility}</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            {goal.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {goal.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-slate-400 font-medium mb-0.5">Desired Outcome:</span>
              <strong className="text-navy-950">{goal.desired_outcome}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-slate-400 font-medium mb-0.5">Timeline:</span>
              <strong className="text-navy-950">{goal.timeline || 'Open-ended'}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-slate-400 font-medium mb-0.5">Budget:</span>
              <strong className="text-navy-950">
                {goal.budget ? `${goal.currency} ${goal.budget}` : 'Unpaid / Exchange'}
              </strong>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Missing-Piece Discovery Engine Panel */}
      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              <h2 className="text-base font-bold text-navy-950">Missing-Piece Discovery Engine</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified critical gaps and strategic needs based on your goal inputs.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddCustom(!showAddCustom)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Custom Missing Piece
          </Button>
        </CardHeader>

        <CardBody className="p-6 space-y-4">
          {showAddCustom && (
            <form onSubmit={handleAddCustomPiece} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mb-4">
              <h4 className="text-xs font-bold text-navy-950 uppercase">Define Your Own Missing Piece</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Missing Skill or Resource (e.g. Legal Review)"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  required
                  placeholder="Why is it needed?"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <input
                type="text"
                placeholder="Suggested Next Action (e.g. Consult with IP advisor)"
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddCustom(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit">Add to Goal</Button>
              </div>
            </form>
          )}

          {activePieces.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              No unresolved missing pieces for this goal.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePieces.map((piece) => {
                const isResolved = piece.status === 'resolved';

                return (
                  <div
                    key={piece.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isResolved
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-navy-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-navy-950">{piece.missing_skill_or_resource}</h4>
                          {piece.is_custom && <Badge variant="slate" size="sm">Custom</Badge>}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {Math.round(piece.confidence_score * 100)}% Confidence Match
                        </span>
                      </div>

                      <Badge variant={isResolved ? 'success' : 'warning'} size="sm">
                        {piece.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {piece.reason}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-navy-900 font-medium">
                      Next Step: {piece.suggested_next_action}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex gap-2">
                        {piece.status === 'suggested' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs"
                            onClick={() => handlePieceAction(piece.id, 'accept')}
                          >
                            Accept
                          </Button>
                        )}
                        {!isResolved && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                            onClick={() => handlePieceAction(piece.id, 'resolve')}
                          >
                            Mark Resolved ✓
                          </Button>
                        )}
                      </div>

                      <button
                        onClick={() => handlePieceAction(piece.id, 'dismiss')}
                        className="text-xs text-slate-400 hover:text-rose-600"
                        title="Dismiss suggestion"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Relevant Recommendations for this Goal */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold-600" />
            <h2 className="text-base font-bold text-navy-950">Recommended People & Offers to Solve This Goal</h2>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {recommendations.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              No matches found yet. Try exploring the Discover tab with customized search filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-gold-700">
                        {rec.type === 'profile' ? 'Profile Match' : 'Service Offer'}
                      </span>
                      <h4 className="text-sm font-bold text-navy-950">
                        {rec.type === 'profile' ? rec.item.display_name : rec.item.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-800 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded">
                      {rec.score}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong className="text-navy-900">Why relevant:</strong> {rec.explanation}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">{rec.recommendedAction}</span>
                    <Link
                      href={
                        rec.type === 'profile'
                          ? `/profile/${rec.item.id}?goal=${goal.id}`
                          : `/offers/${rec.item.id}?goal=${goal.id}`
                      }
                    >
                      <Button variant="outline" size="sm" className="text-xs">
                        Connect
                      </Button>
                    </Link>
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
