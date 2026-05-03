/* ============================================================
   SUPABASE CLIENTS — Server & Browser
   ============================================================ */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://dtjouxwaqcvpnfhnczhk.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0am91eHdhcWN2cG5maG5jemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTMxMzgsImV4cCI6MjA5MjU2OTEzOH0.q64VUZIMfuqL_lQ2S1QDGxe9Wbhld6YTh6NCaS5orIk';

/* ── Browser client (singleton for client components) ───────── */

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}

/* ── Server client (new instance per request — no cookie caching) */

export function getSupabaseServer(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/* ── Service-role server client ─────────────────────────────────
   Bypasses ALL Row Level Security and storage bucket policies.
   ONLY usable in server-side code (never imported by client
   components). Used for trusted operations like uploading to private
   storage buckets and admin-style writes that the anon role can't
   make. The key MUST be set as SUPABASE_SERVICE_ROLE_KEY (server-
   only env var, no NEXT_PUBLIC_ prefix). If unset, throws so the
   misconfiguration surfaces immediately instead of silently falling
   back to anon (which is the failure mode we just spent days
   diagnosing). */

export function getSupabaseServiceRole(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to Vercel ' +
      '(no NEXT_PUBLIC_ prefix) and redeploy.'
    );
  }
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false },
  });
}

/* ── Re-exports for convenience ─────────────────────────────── */

export { SUPABASE_URL, SUPABASE_ANON_KEY };
