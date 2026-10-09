'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <BrandLogo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/how-it-works" className="text-sm font-medium text-navy-800 hover:text-gold-600 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium text-navy-800 hover:text-gold-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/how-it-works"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-navy-800 hover:bg-slate-50 rounded-md"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-base font-medium text-navy-800 hover:bg-slate-50 rounded-md"
          >
            About
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full">
                Log In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
