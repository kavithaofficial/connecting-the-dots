'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { store } from '@/lib/data-provider';
import { offerSchema } from '@/lib/validations/offer';
import { OfferType, DeliveryFormat, PricingModel } from '@/types/database';
import { Briefcase, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NewOfferPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [skillsInput, setSkillsInput] = useState('');
  const [offerType, setOfferType] = useState<OfferType>('paid_service');
  const [deliveryFormat, setDeliveryFormat] = useState<DeliveryFormat>('remote');
  const [pricingModel, setPricingModel] = useState<PricingModel>('fixed');
  const [price, setPrice] = useState<number | ''>(500);
  const [currency, setCurrency] = useState('USD');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const validation = offerSchema.safeParse({
      title,
      description,
      category,
      skills,
      offer_type: offerType,
      delivery_format: deliveryFormat,
      pricing_model: pricingModel,
      price: price === '' ? null : Number(price),
      currency,
      portfolio_url: portfolioUrl || null,
      status: 'active',
    });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    try {
      const created = store.createOffer({
        title,
        description,
        category,
        skills,
        offer_type: offerType,
        delivery_format: deliveryFormat,
        pricing_model: pricingModel,
        price: price === '' ? null : Number(price),
        currency,
        portfolio_url: portfolioUrl || null,
        status: 'active',
      });

      router.push(`/offers/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish offer');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/offers" className="text-xs text-slate-500 hover:text-navy-950 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Offers
      </Link>

      <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-gold-600" />
        Publish an Offer or Service
      </h1>

      <Card>
        <CardBody className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. High-Conversion MVP UI/UX Design"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Product">Product</option>
                  <option value="Advisory">Advisory & Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Offer Type *
                </label>
                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value as OfferType)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="paid_service">Paid Service</option>
                  <option value="free_help">Free Help / Community</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="skill_exchange">Skill Exchange</option>
                  <option value="project_collaboration">Project Collaboration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What exactly will you provide? Detail your experience and deliverables..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Skills Provided (Comma-separated) *
              </label>
              <input
                type="text"
                required
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Figma, UI/UX Design, Prototyping"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Pricing Model
                </label>
                <select
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="negotiable">Negotiable</option>
                  <option value="free">Free</option>
                </select>
              </div>

              {pricingModel !== 'free' && (
                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                    Price Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Delivery Format
                </label>
                <select
                  value={deliveryFormat}
                  onChange={(e) => setDeliveryFormat(e.target.value as DeliveryFormat)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                >
                  <option value="remote">Remote</option>
                  <option value="in_person">In Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <Link href="/offers">
                <Button variant="ghost" type="button">Cancel</Button>
              </Link>
              <Button variant="primary" type="submit">Publish Offer</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
