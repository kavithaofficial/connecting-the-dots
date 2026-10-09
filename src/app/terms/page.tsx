import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-navy-950 mb-6">Terms of Service</h1>
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-4 leading-relaxed">
          <p className="text-xs text-slate-400">Last updated: October 2026 (Initial Template)</p>
          <p>
            Welcome to <strong>Connecting the Dots</strong>. By creating an account or accessing the platform, you agree to these terms.
          </p>
          <h2 className="text-base font-bold text-navy-900 pt-2">1. Respectful Collaboration</h2>
          <p>
            Users agree to interact with integrity, respect community members, and not send unsolicited spam, abusive messages, or deceptive solicitations.
          </p>
          <h2 className="text-base font-bold text-navy-900 pt-2">2. Independent Arrangements</h2>
          <p>
            Connecting the Dots facilitates discovery and purposeful introductions. Any freelance agreement, financial transaction, or advisory arrangement between users is conducted independently between the participants.
          </p>
          <h2 className="text-base font-bold text-navy-900 pt-2">3. Moderation and Community Safety</h2>
          <p>
            Users may report inappropriate content or behavior. Administrators reserve the right to review reports and suspend or restrict accounts that violate community safety rules.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
