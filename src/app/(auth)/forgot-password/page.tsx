'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = forgotPasswordSchema.safeParse({ email });
    if (!val.success) {
      setError(val.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      if (!configured) {
        setSent(true);
        return;
      }

      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-warm">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center mb-6" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-gold-600 hover:text-gold-700">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-lg">
          <CardBody className="p-8 space-y-6">
            {sent ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-navy-950">Reset Instructions Sent</h3>
                <p className="text-xs text-slate-600">
                  If an account exists with <strong className="text-navy-900">{email}</strong>, a password reset email has been dispatched.
                </p>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="primary" size="sm">
                      Return to Log In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                    Your Registered Email
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

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={loading}
                >
                  Send Reset Link
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
