import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Connecting the Dots — Goal-Driven Collaboration & Opportunity Discovery',
  description: 'Discover what you are missing. Connect with the right people. Turn your goals into tangible progress.',
  keywords: ['collaboration', 'startup founders', 'mentorship', 'skill discovery', 'networking', 'opportunities'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-neutral-warm antialiased selection:bg-gold-200 selection:text-navy-950">
        {children}
      </body>
    </html>
  );
}
