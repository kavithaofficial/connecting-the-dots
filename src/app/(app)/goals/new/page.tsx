'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { store } from '@/lib/data-provider';
import { goalSchema } from '@/lib/validations/goal';
import { GoalCategory, CollaborationStyle, GoalVisibility } from '@/types/database';
import { Target, Sparkles, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewGoalPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('build_idea');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [currentProgress, setCurrentProgress] = useState('');
  const [availableSkillsInput, setAvailableSkillsInput] = useState('Next.js, TypeScript');
  const [missingSkillsInput, setMissingSkillsInput] = useState('UI/UX Design, Beta Testers');
  const [collaborationStyle, setCollaborationStyle] = useState<CollaborationStyle>('skill_exchange');
  const [budget, setBudget] = useState<number | ''>('');
  const [currency, setCurrency] = useState('USD');
  const [timeline, setTimeline] = useState('6 weeks');
  const [locationPreference, setLocationPreference] = useState('Remote');
  const [visibility, setVisibility] = useState<GoalVisibility>('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const available_skills = availableSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const missing_skills = missingSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const validation = goalSchema.safeParse({
      title,
      category,
      description,
      desired_outcome: desiredOutcome,
      current_progress: currentProgress || null,
      available_skills,
      missing_skills,
      help_needed_type: null,
      collaboration_style: collaborationStyle,
      budget: budget === '' ? null : Number(budget),
      currency,
      timeline: timeline || null,
      location_preference: locationPreference || null,
      visibility,
      status: 'active',
    });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const createdGoal = store.createGoal({
        title,
        category,
        description,
        desired_outcome: desiredOutcome,
        current_progress: currentProgress || null,
        available_skills,
        missing_skills,
        help_needed_type: null,
        collaboration_style: collaborationStyle,
        budget: budget === '' ? null : Number(budget),
        currency,
        timeline: timeline || null,
        location_preference: locationPreference || null,
        visibility,
        status: 'active',
      });

      router.push(`/goals/${createdGoal.id}?created=true`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/goals" className="text-xs text-slate-500 hover:text-navy-950 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Goals
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
            <Target className="w-6 h-6 text-gold-600" />
            Define a New Goal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            State what you are aiming to accomplish. Our discovery engine will analyze your inputs and suggest what is missing.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardBody className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">
                Goal Category Template
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'build_idea', label: 'Build an Idea', desc: 'Turn concept into MVP' },
                  { id: 'task_help', label: 'Task Help', desc: 'Specific problem' },
                  { id: 'first_users', label: 'Find First Users', desc: 'Feedback & testing' },
                  { id: 'custom', label: 'Custom Initiative', desc: 'Self-defined' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as GoalCategory)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      category === cat.id
                        ? 'bg-navy-900 text-white border-navy-900 ring-2 ring-navy-900/10'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{cat.label}</div>
                    <div className={`text-[10px] mt-0.5 ${category === cat.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Launch AI Code Review Companion MVP"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your initiative in detail. Mention what is already built, technical stack, or background context (at least 20 chars)..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            {/* Desired Outcome */}
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Desired Measurable Outcome *
              </label>
              <input
                type="text"
                required
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="e.g. Ship working beta to 50 active engineering teams"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            {/* Current Progress */}
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Current Progress & Existing Resources (Optional)
              </label>
              <input
                type="text"
                value={currentProgress}
                onChange={(e) => setCurrentProgress(e.target.value)}
                placeholder="e.g. AST parsing engine completed; Next.js frontend scaffolded"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            {/* Skills Available & Missing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Skills You Have (Comma-separated)
                </label>
                <input
                  type="text"
                  value={availableSkillsInput}
                  onChange={(e) => setAvailableSkillsInput(e.target.value)}
                  placeholder="Next.js, Python, PostgreSQL"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Skills You Know You Need (Comma-separated)
                </label>
                <input
                  type="text"
                  value={missingSkillsInput}
                  onChange={(e) => setMissingSkillsInput(e.target.value)}
                  placeholder="UI/UX Design, Growth Marketing"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>
            </div>

            {/* Collaboration Style & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Collaboration Style *
                </label>
                <select
                  value={collaborationStyle}
                  onChange={(e) => setCollaborationStyle(e.target.value as CollaborationStyle)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-navy-900"
                >
                  <option value="skill_exchange">Skill Exchange</option>
                  <option value="joint_project">Joint Project</option>
                  <option value="paid">Paid Help</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="customer_discovery">User Feedback</option>
                  <option value="community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Budget (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-2 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Target Timeline
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. 6 weeks"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Visibility Setting
              </label>
              <div className="flex gap-4 text-xs text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                  />
                  <span>Public (Discoverable by platform)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'connections_only'}
                    onChange={() => setVisibility('connections_only')}
                  />
                  <span>Connections Only</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                  />
                  <span>Private</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link href="/goals">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                variant="gold"
                type="submit"
                isLoading={loading}
                rightIcon={<Sparkles className="w-4 h-4 ml-1" />}
              >
                Create Goal & Discover Missing Pieces
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
