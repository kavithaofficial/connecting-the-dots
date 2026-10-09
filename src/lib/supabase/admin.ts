import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './config';

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isSupabaseConfigured() || !serviceRoleKey || serviceRoleKey.includes('your-service-role')) {
    return null;
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
