'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { store } from '@/lib/data-provider';
import { matchProfileToGoal, matchOfferToGoal, MatchResult } from '@/lib/engine/matching';
import { Profile, Offer, Goal } from '@/types/database';
import {
  Compass,
  Search,
  Filter,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'offers' | 'adjacent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [styleFilter, setStyleFilter] = useState('all');

  useEffect(() => {
    const userGoals = store.getGoals(store.currentUserId);
    setGoals(userGoals);
    if (userGoals.length > 0) {
      setSelectedGoalId(userGoals[0].id);
    }
    setProfiles(store.getProfiles().filter((p) => p.id !== store.currentUserId));
    setOffers(store.getOffers().filter((o) => o.user_id !== store.currentUserId));
  }, []);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];
  const missingPieces = selectedGoal ? store.getMissingPieces(selectedGoal.id) : [];

  // Compute matched profiles
  const matchedProfiles: MatchResult<Profile>[] = profiles
    .map((p) => {
      if (selectedGoal) {
        return matchProfileToGoal(selectedGoal, p, missingPieces);
      }
      return {
        item: p,
        type: 'profile' as const,
        score: 60,
        explanation: `Member with expertise in ${p.skills.slice(0, 2).join(', ')}`,
        recommendedAction: 'Connect to discuss shared interests',
      };
    })
    .filter(Boolean) as MatchResult<Profile>[];

  // Compute matched offers
  const matchedOffers: MatchResult<Offer>[] = offers
    .map((o) => {
      if (selectedGoal) {
        return matchOfferToGoal(selectedGoal, o, missingPieces);
      }
      return {
        item: o,
        type: 'offer' as const,
        score: 55,
        explanation: `Active offer covering ${o.skills.slice(0, 2).join(', ')}`,
        recommendedAction: 'View offer details',
      };
    })
    .filter(Boolean) as MatchResult<Offer>[];

  // Search filtering
  const filterBySearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filteredProfiles = matchedProfiles.filter((m) => {
    const matchesSearch =
      filterBySearch(m.item.display_name) ||
      filterBySearch(m.item.skills.join(' ')) ||
      filterBySearch(m.item.headline || '');
    const matchesStyle =
      styleFilter === 'all' || m.item.collaboration_styles.includes(styleFilter as any);
    return matchesSearch && matchesStyle;
  });

  const filteredOffers = matchedOffers.filter((m) => {
    const matchesSearch =
      filterBySearch(m.item.title) ||
      filterBySearch(m.item.description) ||
      filterBySearch(m.item.skills.join(' '));
    const matchesStyle =
      styleFilter === 'all' || m.item.offer_type === styleFilter;
    return matchesSearch && matchesStyle;
  });

  const adjacentMatches = filteredProfiles.filter((m) => m.isAdjacent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
            <Compass className="w-6 h-6 text-gold-600" />
            Discover People, Skills & Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Every match explains why it is relevant to your goals and which missing piece it helps solve.
          </p>
        </div>
      </div>

      {/* Goal Context Selector */}
      {goals.length > 0 && (
        <Card className="bg-navy-50/50 border-navy-200">
          <CardBody className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
              <span className="text-xs font-semibold text-navy-950">Matching Context Goal:</span>
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1 text-navy-950 font-medium focus:ring-1 focus:ring-navy-900"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.category.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
            {selectedGoal && (
              <span className="text-xs text-slate-500">
                Evaluating against <strong className="text-navy-900">{missingPieces.length}</strong> identified missing pieces
              </span>
            )}
          </CardBody>
        </Card>
      )}

      {/* Search & Tabs */}
      <Card>
        <CardBody className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, names, or offer keywords (e.g. Figma, UI/UX, Growth)..."
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-xs rounded-lg px-2.5 py-2 text-slate-700 w-full sm:w-auto"
              >
                <option value="all">All Collaboration Styles</option>
                <option value="skill_exchange">Skill Exchange</option>
                <option value="joint_project">Joint Project</option>
                <option value="paid">Paid Services</option>
                <option value="mentorship">Mentorship</option>
              </select>
            </div>
          </div>

          <div className="flex border-b border-slate-100 pt-2 gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-navy-900 text-navy-950'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              All Matches ({filteredProfiles.length + filteredOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'people'
                  ? 'border-navy-900 text-navy-950'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              Collaborators & Mentors ({filteredProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'offers'
                  ? 'border-navy-900 text-navy-950'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              Services & Offers ({filteredOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('adjacent')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'adjacent'
                  ? 'border-gold-600 text-gold-700'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              Explore Beyond Your Usual Circle ({adjacentMatches.length})
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Grid of Results */}
      <div className="space-y-6">
        {/* Beyond Your Usual Circle Banner (when active or tab selected) */}
        {(activeTab === 'all' || activeTab === 'adjacent') && adjacentMatches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                Explore Beyond Your Usual Circle
              </h3>
              <Badge variant="gold" size="sm">Adjacent Opportunities</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adjacentMatches.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gold-200 bg-gold-50/20 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-navy-950">{m.item.display_name}</h4>
                      <p className="text-xs text-slate-500">{m.item.headline}</p>
                    </div>
                    <Badge variant="gold" size="sm">{m.score}% Complementary</Badge>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    <strong className="text-navy-900">Why this matters:</strong> {m.explanation}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gold-100">
                    <div className="flex flex-wrap gap-1">
                      {m.item.skills.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                    <Link href={`/profile/${m.item.id}?goal=${selectedGoalId}`}>
                      <Button variant="primary" size="sm" className="text-xs">
                        Connect
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Profiles */}
        {(activeTab === 'all' || activeTab === 'people') && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-navy-700" /> People Who Can Fill a Missing Piece
            </h3>

            {filteredProfiles.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No profile matches found for this filter.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProfiles.map((m, idx) => (
                  <Card key={idx} hoverEffect className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-navy-950">{m.item.display_name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{m.item.headline}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded shrink-0">
                        {m.score}% Match
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                      <div className="text-navy-900 font-medium">
                        <strong className="text-gold-700">Why relevant:</strong> {m.explanation}
                      </div>
                      {m.missingPieceSolved && (
                        <div className="text-emerald-700 font-semibold">
                          ✓ Solves: {m.missingPieceSolved}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {m.item.skills.map((s) => (
                        <span key={s} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {m.item.location || 'Remote'}
                      </span>
                      <Link href={`/profile/${m.item.id}?goal=${selectedGoalId}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View & Request Connection
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offers */}
        {(activeTab === 'all' || activeTab === 'offers') && (
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-navy-700" /> Relevant Services & Offers
            </h3>

            {filteredOffers.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No offers matching your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOffers.map((m, idx) => (
                  <Card key={idx} hoverEffect className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="navy" size="sm">{m.item.category}</Badge>
                        <h4 className="text-base font-bold text-navy-950 mt-1">{m.item.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded shrink-0">
                        {m.score}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {m.item.description}
                    </p>

                    <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-navy-900 font-medium">
                      <strong>Why relevant:</strong> {m.explanation}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-950">
                        {m.item.pricing_model === 'free' ? 'Free Help' : `${m.item.currency} ${m.item.price} (${m.item.pricing_model})`}
                      </span>
                      <Link href={`/offers/${m.item.id}?goal=${selectedGoalId}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View Offer Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
