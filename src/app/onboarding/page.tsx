'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { CollaborationStyle } from '@/types/database';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Next.js', 'React', 'TypeScript', 'Python', 'Machine Learning',
  'UI/UX Design', 'Figma', 'Product Strategy', 'Growth Marketing',
  'Community Building', 'Customer Discovery', 'PostgreSQL', 'System Architecture'
];

const COLLABORATION_OPTIONS: { id: CollaborationStyle; label: string; desc: string }[] = [
  { id: 'skill_exchange', label: 'Skill Exchange', desc: 'Trade complementary skills without money changing hands' },
  { id: 'joint_project', label: 'Joint Project', desc: 'Build an open source or co-founded venture together' },
  { id: 'paid', label: 'Paid Services', desc: 'Offer or hire specialized professional services' },
  { id: 'mentorship', label: 'Mentorship', desc: 'Provide or receive strategic guidance' },
  { id: 'customer_discovery', label: 'User Feedback', desc: 'Participate in user testing and early product validation' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('Elena Rostova');
  const [headline, setHeadline] = useState('Full-stack Engineer & AI Builder');
  const [bio, setBio] = useState('Passionate about turning complex systems into intuitive tools.');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Next.js', 'TypeScript', 'Python']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<CollaborationStyle[]>(['skill_exchange', 'joint_project']);
  const [isRemoteOnly, setIsRemoteOnly] = useState(true);
  const [location, setLocation] = useState('San Francisco, CA');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(customSkillInput.trim())) {
        setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      }
      setCustomSkillInput('');
    }
  };

  const toggleStyle = (style: CollaborationStyle) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleFinish = () => {
    store.updateProfile(store.currentUserId, {
      display_name: displayName,
      headline,
      bio,
      skills: selectedSkills,
      collaboration_styles: selectedStyles,
      is_remote_only: isRemoteOnly,
      location,
    });
    router.push('/dashboard?onboarded=true');
  };

  return (
    <div className="min-h-screen bg-neutral-warm py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <BrandLogo size="lg" className="justify-center mb-6" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Step {step} of 2: Profile & Collaboration Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Welcome! Let's tailor your experience.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You can always update these anytime in your profile settings.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardBody className="p-8 space-y-6">
            {step === 1 ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                    Headline (Who are you and what do you focus on?)
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    placeholder="e.g. Technical Founder | AI & Full-Stack"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                    Short Bio
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    placeholder="Briefly describe what you're working on or hoping to learn..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">
                    Your Primary Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SUGGESTED_SKILLS.map((skill) => {
                      const selected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            selected
                              ? 'bg-navy-900 text-white border-navy-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {skill} {selected ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={addCustomSkill}
                    placeholder="Type custom skill and press Enter..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setStep(2)}
                    rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                  >
                    Continue to Preferences
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">
                    How do you prefer to collaborate? (Select all that apply)
                  </label>
                  <div className="space-y-2.5">
                    {COLLABORATION_OPTIONS.map((opt) => {
                      const checked = selectedStyles.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleStyle(opt.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            checked
                              ? 'bg-navy-50/70 border-navy-800 ring-1 ring-navy-800'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-[10px] ${
                            checked ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300'
                          }`}>
                            {checked && '✓'}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-navy-950">{opt.label}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                      General Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-navy-900 font-medium">
                      <input
                        type="checkbox"
                        checked={isRemoteOnly}
                        onChange={(e) => setIsRemoteOnly(e.target.checked)}
                        className="rounded border-slate-300 text-navy-900 focus:ring-navy-900"
                      />
                      Open to remote collaboration
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="gold"
                    onClick={handleFinish}
                    rightIcon={<CheckCircle2 className="w-4 h-4 ml-1" />}
                  >
                    Complete Onboarding & Enter Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
