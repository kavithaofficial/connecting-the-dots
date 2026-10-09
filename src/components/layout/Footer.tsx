import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" className="text-white" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Discover what you are missing. Connect with the right people. Turn your goals into tangible progress.
            </p>
            <div className="text-xs text-slate-500 pt-2">
              Goal-driven collaboration and opportunity discovery platform.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/how-it-works" className="hover:text-gold-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About the Vision
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-gold-400 transition-colors">
                  Create a Goal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Legal & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@connectingthedots.local" className="hover:text-gold-400 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Connecting the Dots. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Built for founders, creators, and ambitious collaborators.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
