-- =============================================================
-- Aegis AI — Supabase Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================================

-- 1. Modernization logs (Legacy Modernization page)
CREATE TABLE IF NOT EXISTS modernization_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  source_code TEXT NOT NULL,
  output_code TEXT NOT NULL,
  model       TEXT NOT NULL DEFAULT 'gpt-4o',
  tokens_est  INT,
  duration_ms INT
);

-- 2. Chat logs (ITSM Copilot page)
CREATE TABLE IF NOT EXISTS chat_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  model       TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  tokens_est  INT
);

-- Enable Row Level Security (recommended for production)
ALTER TABLE modernization_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the anon key (public client)
CREATE POLICY "Allow anon insert on modernization_logs"
  ON modernization_logs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon select on modernization_logs"
  ON modernization_logs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on chat_logs"
  ON chat_logs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon select on chat_logs"
  ON chat_logs FOR SELECT
  TO anon
  USING (true);
