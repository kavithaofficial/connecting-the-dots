'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!configured) {
        // Fallback for local demo preview when Supabase env vars are pending
        router.push('/dashboard');
        return;
      }

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userRole: 'elena' | 'marcus' | 'admin') => {
    // Allows instant developer inspection of different views
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-warm">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center mb-6" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-gold-600 hover:text-gold-700">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-lg">
          <CardBody className="p-8 space-y-6">
            {!configured && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Development Mode:</strong> Supabase environment variables are currently in placeholder mode. You can log in directly or use the quick evaluation profiles below.
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-gold-600 hover:text-gold-700">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={loading}
              >
                Sign In
              </Button>
            </form>

            {/* Quick Evaluation Profiles */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium text-center mb-3">
                Quick Dev Inspection (Instant Sign-in):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('elena')}
                  className="py-1.5 px-2 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-navy-900 text-center"
                >
                  Elena (Founder)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('marcus')}
                  className="py-1.5 px-2 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-navy-900 text-center"
                >
                  Marcus (Designer)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="py-1.5 px-2 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-navy-900 text-center"
                >
                  David (Admin)
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
