import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-navy-950 mb-6">Privacy Policy</h1>
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-4 leading-relaxed">
          <p className="text-xs text-slate-400">Last updated: October 2026 (Initial Template)</p>
          <p>
            At <strong>Connecting the Dots</strong>, your privacy and control over your personal data are paramount. We collect only the information necessary to facilitate purposeful connections, identify missing project resources, and manage collaborations.
          </p>
          <h2 className="text-base font-bold text-navy-900 pt-2">1. Information We Collect</h2>
          <p>
            We collect profile information you voluntarily submit (such as name, skills, and headline), goals you publish, offers you list, and direct messages sent within authorized collaboration workspaces.
          </p>
          <h2 className="text-base font-bold text-navy-900 pt-2">2. Visibility and Discoverability</h2>
          <p>
            You have full control over your discoverability preferences. Private goals are never exposed in public search listings. Your email address is never made public to other members.
          </p>
          <h2 className="text-base font-bold text-navy-900 pt-2">3. Data Security</h2>
          <p>
            Data is stored in Supabase PostgreSQL with strict Row Level Security (RLS) policies enforcing that only authorized members can read private messages and collaboration tasks.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
