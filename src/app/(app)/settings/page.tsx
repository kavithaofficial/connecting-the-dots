'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { Profile } from '@/types/database';
import { Settings, Save, CheckCircle2, User, Eye, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = store.getCurrentUser();
    setProfile(p);
    setDisplayName(p.display_name);
    setHeadline(p.headline || '');
    setBio(p.bio || '');
    setLocation(p.location || '');
    setIsDiscoverable(p.is_discoverable);
    setPortfolioUrl(p.portfolio_url || '');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    store.updateProfile(profile.id, {
      display_name: displayName,
      headline,
      bio,
      location,
      is_discoverable: isDiscoverable,
      portfolio_url: portfolioUrl || null,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSignOut = () => {
    document.cookie = 'sb-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gold-600" />
          Account & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your public profile identity, discoverability, and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <User className="w-4 h-4 text-navy-700" /> Profile Information
            </h2>
            <Badge variant="navy" size="sm">Role: {profile.role}</Badge>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                Bio / About
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                  Portfolio / Website URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
            </div>

            {/* Discoverability */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-navy-950 block">Platform Discoverability</label>
                <p className="text-[11px] text-slate-500">Allow your profile and skills to appear in Discover recommendations.</p>
              </div>
              <input
                type="checkbox"
                checked={isDiscoverable}
                onChange={(e) => setIsDiscoverable(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-navy-900 focus:ring-navy-900"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Account actions card */}
      <Card>
        <CardBody className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy-950">Session Management</h3>
            <p className="text-xs text-slate-500">Sign out of your active browser session.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="text-rose-600 hover:bg-rose-50" leftIcon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
