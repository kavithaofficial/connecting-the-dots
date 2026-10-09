import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return dummy or fallback when unconfigured so build & client components don't crash
    return createBrowserClient(
      'https://dummy.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy'
    );
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
