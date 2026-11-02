// Idempotent schema migration. Run: node --env-file=.env.local scripts/migrate.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing");
const sql = neon(url);

const statements = [
  `CREATE TABLE IF NOT EXISTS weddings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id text NOT NULL,
    slug text UNIQUE NOT NULL,
    profile jsonb NOT NULL DEFAULT '{}'::jsonb,
    theme text NOT NULL DEFAULT 'konkan-sunset',
    step int NOT NULL DEFAULT 0,
    published boolean NOT NULL DEFAULT false,
    plan text NOT NULL DEFAULT 'free',
    custom_domain text UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS weddings_owner_idx ON weddings(owner_id)`,
  `CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('user','assistant')),
    content text NOT NULL,
    chips jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp()
  )`,
  `CREATE INDEX IF NOT EXISTS messages_wedding_idx ON messages(wedding_id, created_at)`,
  `CREATE TABLE IF NOT EXISTS guests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    status text NOT NULL DEFAULT 'added',
    sent_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (wedding_id, email)
  )`,
  `CREATE TABLE IF NOT EXISTS rsvps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    guest_name text NOT NULL,
    email text,
    attending boolean NOT NULL,
    party_size int NOT NULL DEFAULT 1,
    message text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS rsvps_wedding_idx ON rsvps(wedding_id, created_at DESC)`,
];

for (const s of statements) await sql.query(s);
console.log(`✓ migrated (${statements.length} statements)`);
