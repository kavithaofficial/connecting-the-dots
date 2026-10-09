'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { Offer } from '@/types/database';
import { Briefcase, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OfferDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const offerId = params?.id as string;
  const relatedGoalId = searchParams.get('goal');

  const [offer, setOffer] = useState<Offer | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!offerId) return;
    const o = store.getOfferById(offerId);
    if (!o) {
      router.push('/offers');
      return;
    }
    setOffer(o);
    if (relatedGoalId) {
      const g = store.getGoalById(relatedGoalId);
      if (g) {
        setConnectMessage(`Hi! I am working on "${g.title}" and noticed your offer for ${o.title}. Would love to connect and discuss collaborating!`);
      }
    }
  }, [offerId, relatedGoalId, router]);

  if (!offer) return <div className="p-8 text-center text-slate-500">Loading offer...</div>;

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!connectMessage.trim()) {
      setError('Please provide a short message explaining your intent.');
      return;
    }

    try {
      store.createConnectionRequest({
        recipient_id: offer.user_id,
        offer_id: offer.id,
        goal_id: relatedGoalId || null,
        message: connectMessage,
      });
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send request');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/offers" className="text-xs text-slate-500 hover:text-navy-950 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Offers
      </Link>

      <Card>
        <CardBody className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="navy" size="md">{offer.category}</Badge>
            <Badge variant={offer.pricing_model === 'free' ? 'success' : 'gold'} size="md">
              {offer.pricing_model === 'free' ? 'Free Help' : `${offer.currency} ${offer.price} (${offer.pricing_model})`}
            </Badge>
          </div>

          <h1 className="text-2xl font-extrabold text-navy-950">{offer.title}</h1>

          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {offer.description}
          </p>

          <div>
            <h4 className="text-xs font-semibold text-navy-950 uppercase mb-2">Skills Covered</h4>
            <div className="flex flex-wrap gap-1.5">
              {offer.skills.map((s) => (
                <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Offered by: <strong className="text-navy-900">{offer.profiles?.display_name}</strong></span>
            <span>Format: <strong className="text-navy-900 capitalize">{offer.delivery_format}</strong></span>
          </div>
        </CardBody>
      </Card>

      {/* Connect with Provider */}
      <Card className="border-gold-200 bg-gold-50/20">
        <CardBody className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
            <Send className="w-4 h-4 text-gold-600" />
            Request a Connection Regarding This Offer
          </h3>

          {sent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Connection request sent to {offer.profiles?.display_name}! You will be notified when they respond.</span>
            </div>
          ) : (
            <form onSubmit={handleSendRequest} className="space-y-3">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
              <textarea
                rows={3}
                required
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                placeholder="Introduce yourself and explain what you'd like to collaborate on..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
              />
              <div className="flex justify-end">
                <Button variant="gold" size="sm" type="submit">
                  Send Purposeful Request
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
