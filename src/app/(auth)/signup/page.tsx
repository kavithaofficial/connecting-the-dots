'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { signUpSchema } from '@/lib/validations/auth';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Zod validation
    const validation = signUpSchema.safeParse({ fullName, email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      if (!configured) {
        // In local demo mode, advance straight to onboarding
        router.push('/onboarding');
        return;
      }

      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        router.push('/onboarding');
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-warm">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center mb-6" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-gold-600 hover:text-gold-700">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-lg">
          <CardBody className="p-8 space-y-6">
            {success ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-navy-950">Verification link sent!</h3>
                <p className="text-xs text-slate-600">
                  We sent a confirmation link to <strong className="text-navy-900">{email}</strong>. Please check your inbox to activate your account.
                </p>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Return to Log In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition"
                  />
                </div>

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
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 chars, 1 uppercase, 1 number"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Must be at least 8 characters with numbers and capitals.</p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={loading}
                >
                  Create Account & Get Started
                </Button>

                <p className="text-[11px] text-slate-400 text-center mt-3">
                  By joining, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-navy-900">Terms</Link> and{' '}
                  <Link href="/privacy" className="underline hover:text-navy-900">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
