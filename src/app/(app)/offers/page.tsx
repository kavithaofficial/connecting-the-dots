'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { store } from '@/lib/data-provider';
import { Offer } from '@/types/database';
import { Briefcase, Plus, Filter, ArrowRight, MapPin } from 'lucide-react';

export default function OffersListPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    setOffers(store.getOffers());
  }, []);

  const filteredOffers = offers.filter((o) => {
    if (typeFilter !== 'all' && o.offer_type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-gold-600" />
            Offers & Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Share what you can help with, find paid services, or connect with mentors and peers offering free assistance.
          </p>
        </div>
        <Link href="/offers/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Publish New Offer
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardBody className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-navy-950 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Type:
            </span>
            {['all', 'paid_service', 'free_help', 'mentorship', 'skill_exchange'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  typeFilter === type
                    ? 'bg-navy-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No offers found"
          description="Publish your first offer to showcase how you can assist other founders and creators."
          actionLabel="Publish an Offer"
          actionHref="/offers/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} hoverEffect className="flex flex-col justify-between">
              <CardBody className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="navy" size="sm">{offer.category}</Badge>
                  <Badge variant={offer.pricing_model === 'free' ? 'success' : 'gold'} size="sm">
                    {offer.pricing_model === 'free' ? 'Free' : `${offer.currency} ${offer.price} (${offer.pricing_model})`}
                  </Badge>
                </div>

                <h2 className="text-base font-bold text-navy-950 hover:text-gold-600 transition-colors line-clamp-1">
                  <Link href={`/offers/${offer.id}`}>{offer.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {offer.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-2">
                  {offer.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-navy-900">{offer.profiles?.display_name}</span>
                  <span className="capitalize">{offer.delivery_format}</span>
                </div>
              </CardBody>

              <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs">
                <Link href={`/offers/${offer.id}`} className="font-semibold text-navy-900 hover:text-gold-600 flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
