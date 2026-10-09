'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { Profile, Goal, Offer } from '@/types/database';
import {
  User,
  MapPin,
  Globe,
  ExternalLink,
  Send,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Target,
  ArrowLeft,
} from 'lucide-react';

export default function ProfileDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetId = params?.id === 'me' ? store.currentUserId : (params?.id as string);
  const relatedGoalId = searchParams.get('goal');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Moderation Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content or spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    const p = store.getProfileById(targetId);
    if (!p) {
      router.push('/discover');
      return;
    }
    setProfile(p);
    setGoals(store.getGoals(targetId).filter((g) => g.visibility === 'public'));
    setOffers(store.getOffers().filter((o) => o.user_id === targetId && o.status === 'active'));

    if (relatedGoalId) {
      const g = store.getGoalById(relatedGoalId);
      if (g) {
        setRequestMessage(`Hi ${p.display_name}! I am working on "${g.title}" and would love to collaborate on complementary skills.`);
      }
    }
  }, [targetId, relatedGoalId, router]);

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  const isOwnProfile = profile.id === store.currentUserId;

  const handleSendConnection = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError(null);

    try {
      store.createConnectionRequest({
        recipient_id: profile.id,
        goal_id: relatedGoalId || null,
        message: requestMessage.trim(),
      });
      setRequestSent(true);
      setShowMessageModal(false);
    } catch (err: unknown) {
      setRequestError(err instanceof Error ? err.message : 'Failed to send request');
    }
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    store.createReport({
      target_type: 'profile',
      target_id: profile.id,
      reason: reportReason,
      details: reportDetails,
    });
    setReportSent(true);
    setShowReportModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/discover" className="text-xs text-slate-500 hover:text-navy-950 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
      </Link>

      {/* Main Profile Header */}
      <Card className="shadow-sm">
        <CardBody className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-navy-900 text-gold-400 font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">
                {profile.display_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950">{profile.display_name}</h1>
                  {profile.role === 'admin' && <Badge variant="gold" size="sm">Admin</Badge>}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">{profile.headline}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {profile.location || 'Remote'}
                  </span>
                  {profile.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => setShowMessageModal(true)}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Request Connection
                </Button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  title="Report Profile"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {requestSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Connection request dispatched! You will receive a notification when {profile.display_name} responds.</span>
            </div>
          )}

          {reportSent && (
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-600" />
              <span>Thank you for helping keep the community safe. Our moderation team has received the report.</span>
            </div>
          )}

          {profile.bio && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1.5">About</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Skills */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Skills & Strengths</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span key={s} className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Collaboration Preferences */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">Collaboration Styles</h3>
            <div className="flex flex-wrap gap-2">
              {profile.collaboration_styles.map((s) => (
                <Badge key={s} variant="navy" size="md">
                  {s.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Public Goals */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Target className="w-4 h-4 text-gold-600" /> Public Goals & Projects
            </h3>
          </CardHeader>
          <CardBody className="p-5 space-y-3">
            {goals.map((g) => (
              <div key={g.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-navy-950">{g.title}</h4>
                  <Badge variant="navy" size="sm">{g.category.replace('_', ' ')}</Badge>
                </div>
                <p className="text-xs text-slate-600">{g.description}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Active Offers */}
      {offers.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gold-600" /> Published Offers
            </h3>
          </CardHeader>
          <CardBody className="p-5 space-y-3">
            {offers.map((o) => (
              <div key={o.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-navy-950">{o.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{o.description}</p>
                </div>
                <Badge variant="gold" size="sm">
                  {o.pricing_model === 'free' ? 'Free' : `${o.currency} ${o.price}`}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Connection Request Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-navy-950">
              Request Connection with {profile.display_name}
            </h3>
            <p className="text-xs text-slate-500">
              Explain why you want to connect, which goal it relates to, and how you can collaborate together.
            </p>

            {requestError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                {requestError}
              </div>
            )}

            <form onSubmit={handleSendConnection} className="space-y-4">
              <textarea
                rows={4}
                required
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Hi, I am working on... and would love to collaborate..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowMessageModal(false)}>
                  Cancel
                </Button>
                <Button variant="gold" size="sm" type="submit">
                  Send Purposeful Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Moderation Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Report Profile
            </h3>
            <form onSubmit={handleReport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                >
                  <option value="Spam or commercial advertising">Spam or commercial advertising</option>
                  <option value="Harassment or inappropriate message">Harassment or inappropriate behavior</option>
                  <option value="Impersonation or false credentials">Impersonation or false credentials</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300"
                  placeholder="Provide context for moderation review..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowReportModal(false)}>Cancel</Button>
                <Button variant="danger" size="sm" type="submit">Submit Report</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
