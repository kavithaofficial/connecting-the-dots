import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import {
  Target,
  Search,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Lightbulb,
  Briefcase,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-white via-neutral-warm to-neutral-warm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Goal-Driven Collaboration & Opportunity Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-950 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Your next breakthrough might be the connection you{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-amber-600">
              haven't made yet.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Start with a goal. Discover the skills, people, and opportunities you're missing. Build meaningful connections that help you move forward.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
                Find My Missing Pieces
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore How It Works
              </Button>
            </Link>
          </div>

          {/* Interactive Live Interactive Product Preview */}
          <div className="mt-14 max-w-4xl mx-auto text-left">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
              <div className="bg-navy-950 px-6 py-3.5 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400">Illustrative Goal & Discovery Preview</span>
                </div>
                <Badge variant="gold" size="sm">Active Goal</Badge>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gold-700 uppercase tracking-wider mb-1">
                    <Target className="w-4 h-4" /> Goal Definition
                  </div>
                  <h3 className="text-xl font-bold text-navy-950">
                    Launch AI Code Review Companion MVP
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Building a developer tool to spot bugs during PR reviews. Core engine finished in Python & Next.js.
                  </p>
                </div>

                {/* Missing pieces highlight */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      Missing-Piece Discovery Engine Identified:
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">95% Confidence</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-navy-950">UI/UX Design & Prototyping</span>
                        <Badge variant="warning" size="sm">Missing Skill</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Developer tools require clean diff views to prevent cognitive overload.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-navy-950">5 Beta Testing Teams</span>
                        <Badge variant="slate" size="sm">Missing Resource</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Need feedback from active engineering leads to tune accuracy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explainable recommendation */}
                <div className="p-4 rounded-xl bg-gold-50/50 border border-gold-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-gold-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gold-600" />
                      Recommended Match: Marcus Vance (Product Designer)
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-navy-900">Why relevant:</span> Direct match for your missing UI/UX Design skill. Looking for technical partners in exchange for design systems.
                    </p>
                  </div>
                  <Link href="/signup">
                    <Button variant="gold" size="sm" className="whitespace-nowrap">
                      Connect & Collaborate
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-gold-700 uppercase tracking-widest mb-2">Workflow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Four steps from an idea to measurable progress
            </p>
            <p className="text-base text-slate-600 mt-3">
              Traditional networks show endless feeds. Connecting the Dots gives you an actionable engine focused entirely on your outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="relative p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-navy-950">Define Your Goal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                State what you want to achieve: build an MVP, solve a technical task, or find your first 100 customers.
              </p>
            </Card>

            <Card className="relative p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-navy-950">Discover What's Missing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our deterministic engine pinpoints the skills, roles, and resources you lack, explaining why each matters.
              </p>
            </Card>

            <Card className="relative p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-navy-950">Find Relevant People</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explore explainable recommendations. Discover people who can fill your gaps or complementary service offers.
              </p>
            </Card>

            <Card className="relative p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="text-lg font-bold text-navy-950">Collaborate & Achieve</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Send a purposeful connection request, open a workspace, manage tasks, and track outcomes together.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Distinct Use Cases */}
      <section className="py-20 bg-neutral-warm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-gold-700 uppercase tracking-widest mb-2">Designed For You</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              Built for real creators, founders, and problem solvers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverEffect className="p-6">
              <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5 text-navy-700" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Turn Ideas Into Projects</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You have a spark or working code, but lack design polish or a co-builder. Find complementary skills through skill exchange or joint projects.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5 text-navy-700" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Solve Difficult Tasks</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Stuck on a database query, security vulnerability, or API integration? Connect with an expert for targeted guidance or paid consulting.
              </p>
            </Card>

            <Card hoverEffect className="p-6">
              <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-navy-700" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2">Find First Users & Feedback</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect with prospective customers willing to trial your MVP and give structured, honest feedback before public launch.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Closing CTA */}
      <section className="py-20 md:py-28 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800 text-gold-400 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Complete User Control & Intentional Connections</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Stop waiting for serendipity. Start discovering what your goal is missing.
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Recipients maintain complete control over incoming requests. No spam, no cold pitch walls—only purposeful collaborations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="gold" size="lg" className="w-full sm:w-auto font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent text-white border-slate-700 hover:bg-navy-900">
                Log In to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
