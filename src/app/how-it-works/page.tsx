import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Target, Search, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Define Your Goal with Precision',
      desc: 'Whether building an idea from scratch, solving a difficult technical task, or acquiring your first 100 users, define your goal, timeline, and available skills.',
      icon: Target,
    },
    {
      num: '02',
      title: 'Discover Your Missing Pieces',
      desc: 'Our deterministic engine maps out the critical gaps in your project—from UI/UX prototyping to beta testing cohorts—explaining why each piece matters.',
      icon: Search,
    },
    {
      num: '03',
      title: 'Explore Explainable Matches',
      desc: 'Browse recommendations where every suggestion explicitly details which missing piece the collaborator or offer solves and why it is compatible.',
      icon: Users,
    },
    {
      num: '04',
      title: 'Collaborate and Track Outcomes',
      desc: 'Send a purposeful connection request. Once accepted, spin up a dedicated collaboration workspace with shared tasks, milestones, and direct messaging.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            How Connecting the Dots Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            From an initial spark to tangible milestones: a structured, goal-first workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.num} className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-lg">
                    {s.num}
                  </div>
                  <div className="p-2.5 rounded-lg bg-navy-50 text-navy-800">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy-950">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </Card>
            );
          })}
        </div>

        <div className="text-center bg-navy-900 text-white rounded-2xl p-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to turn your goal into progress?</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Create your account in under 60 seconds and run your first goal through the Missing-Piece Discovery Engine.
          </p>
          <div>
            <Link href="/signup">
              <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
