-- Pay Qist — Vercel Blob metadata + core tables (Neon Postgres)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS blobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathname TEXT NOT NULL,
  url TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  access TEXT NOT NULL DEFAULT 'private' CHECK (access IN ('public', 'private')),
  uploaded_by TEXT,
  entity_type TEXT,
  entity_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blobs_entity_idx ON blobs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS blobs_uploaded_by_idx ON blobs (uploaded_by);
CREATE INDEX IF NOT EXISTS blobs_created_at_idx ON blobs (created_at DESC);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  blob_id UUID REFERENCES blobs (id) ON DELETE SET NULL,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  allowed_installment_months INTEGER[] NOT NULL DEFAULT '{3,6,12}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

CREATE TABLE IF NOT EXISTS comments (
  comment TEXT
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  cnic TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  avatar_pathname TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles (email);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles (role);
