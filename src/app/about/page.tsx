import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Target, Users, Zap, Shield, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Product Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            About Connecting the Dots
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Bridging the gap between ambitious ideas and the missing skills, collaborators, and resources needed to bring them to life.
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed bg-white p-8 sm:p-12 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-navy-950 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-gold-600" />
              The Core Problem
            </h2>
            <p>
              People regularly develop ideas, build early prototypes, or face thorny business roadblocks without knowing what they are truly missing. Standard social networks surface vanity metrics and endless algorithmic feeds, while job boards lock users into rigid employer-employee binaries. Ambitious builders rarely have a place to formulate a goal and immediately discover the specific missing pieces holding them back.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-navy-950 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold-600" />
              Our Core Promise
            </h2>
            <blockquote className="p-4 bg-navy-50/60 border-l-4 border-gold-500 rounded-r-lg font-medium text-navy-900 italic">
              “Discover what you are missing. Connect with the right people. Turn your goals into progress.”
            </blockquote>
            <p className="mt-3">
              Every recommendation in Connecting the Dots answers four fundamental questions:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-600">
              <li><strong>What is this user or resource?</strong></li>
              <li><strong>Why is it relevant to my goal?</strong></li>
              <li><strong>Which missing piece could it help solve?</strong></li>
              <li><strong>What concrete action can I take next?</strong></li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-navy-950 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-600" />
              Intentionality & Recipient Control
            </h2>
            <p>
              We believe networking works best when every connection has a clear purpose. Recipients always retain full control over accepting or declining connection requests, with zero unsolicited pitch automation or algorithmic manipulation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
