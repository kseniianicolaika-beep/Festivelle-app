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

  // ── Multi-tenancy: workspaces (personal or agency); one email can belong to many ──
  `CREATE TABLE IF NOT EXISTS workspaces (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    kind text NOT NULL DEFAULT 'personal' CHECK (kind IN ('personal','agency')),
    brand jsonb NOT NULL DEFAULT '{}'::jsonb,
    plan text NOT NULL DEFAULT 'free',
    created_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS members (
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    email text NOT NULL,
    role text NOT NULL CHECK (role IN ('owner','admin','designer','client','family')),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
  )`,
  `CREATE INDEX IF NOT EXISTS members_user_idx ON members(user_id)`,
  `CREATE TABLE IF NOT EXISTS invites (
    token text PRIMARY KEY,
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email text NOT NULL,
    role text NOT NULL,
    invited_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    accepted_at timestamptz
  )`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS client_name text`,
  `CREATE INDEX IF NOT EXISTS weddings_ws_idx ON weddings(workspace_id)`,

  // ── Pieces: every invitation, sign, menu, story or website is a document with a template + design ──
  `CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    kind text NOT NULL,
    layout text NOT NULL,
    design jsonb NOT NULL DEFAULT '{}'::jsonb,
    position int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS documents_wedding_idx ON documents(wedding_id, position)`,

  // ── Asset library (per workspace, optionally tied to a wedding) ──
  `CREATE TABLE IF NOT EXISTS assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    wedding_id uuid REFERENCES weddings(id) ON DELETE SET NULL,
    key text NOT NULL UNIQUE,
    name text,
    kind text NOT NULL DEFAULT 'photo' CHECK (kind IN ('photo','logo','other')),
    content_type text,
    size int,
    created_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS assets_ws_idx ON assets(workspace_id, created_at DESC)`,

  // ── Commerce: packages, hosting windows, subdomains, orders, promos, partners, AI credits, settings ──
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS tier text`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS video_tier text`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS activated_at timestamptz`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS expires_at timestamptz`,
  `ALTER TABLE weddings ADD COLUMN IF NOT EXISTS subdomain text UNIQUE`,
  `CREATE TABLE IF NOT EXISTS settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_by text,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS partners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    category text NOT NULL,
    city text,
    url text,
    blurb text,
    offer text,
    listing text NOT NULL DEFAULT 'free' CHECK (listing IN ('free','featured','sponsored')),
    ref_code text UNIQUE NOT NULL,
    commission_pct numeric NOT NULL DEFAULT 10,
    contact_email text,
    agreement text,
    active boolean NOT NULL DEFAULT true,
    clicks int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS promos (
    code text PRIMARY KEY,
    percent_off int NOT NULL DEFAULT 0 CHECK (percent_off BETWEEN 0 AND 100),
    max_uses int,
    uses int NOT NULL DEFAULT 0,
    expires_at timestamptz,
    partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text NOT NULL,
    email text,
    wedding_id uuid REFERENCES weddings(id) ON DELETE SET NULL,
    product text NOT NULL,
    description text NOT NULL,
    currency text NOT NULL,
    amount_minor int NOT NULL,
    list_minor int NOT NULL,
    promo_code text,
    partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
    commission_minor int NOT NULL DEFAULT 0,
    provider text NOT NULL,
    provider_ref text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
    paid_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS orders_ref_idx ON orders(provider, provider_ref)`,
  `CREATE TABLE IF NOT EXISTS credits (
    user_id text PRIMARY KEY,
    balance int NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS ai_usage (
    user_id text NOT NULL,
    day date NOT NULL DEFAULT current_date,
    kind text NOT NULL DEFAULT 'text',
    n int NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, day, kind)
  )`,

  // ── Guests 2.0 (fork C): households, per-event invites, personal links, meals, plus-ones, reminders, guest gallery ──
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS household text`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS phone text`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS token text UNIQUE`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS events text[]`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_ones int NOT NULL DEFAULT 0`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS lang text`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS notes text`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS reminded_at timestamptz`,
  `ALTER TABLE guests ADD COLUMN IF NOT EXISTS opened_at timestamptz`,
  `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS guest_id uuid REFERENCES guests(id) ON DELETE SET NULL`,
  `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS events jsonb`,
  `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS meal text`,
  `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS dietary text`,
  `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS plus_one_name text`,
  `CREATE TABLE IF NOT EXISTS guest_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    key text NOT NULL UNIQUE,
    uploader text,
    caption text,
    approved boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS guest_photos_w_idx ON guest_photos(wedding_id, created_at DESC)`,

  // ── Visual editor (fork A): quiet edit messages in the chat + per-piece version history for undo/redo ──
  `ALTER TABLE messages ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'chat'`,
  `CREATE TABLE IF NOT EXISTS doc_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    layout text NOT NULL,
    design jsonb NOT NULL,
    label text,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp()
  )`,
  `CREATE INDEX IF NOT EXISTS doc_versions_doc_idx ON doc_versions(document_id, created_at DESC)`,
];

for (const s of statements) await sql.query(s);

// Backfill: every existing wedding owner gets a personal workspace; weddings move into it.
const owners = await sql.query(`SELECT DISTINCT owner_id FROM weddings WHERE workspace_id IS NULL`);
for (const { owner_id } of owners) {
  const [u] = await sql.query(`SELECT email, name FROM neon_auth."user" WHERE id::text = $1`, [owner_id]).catch(() => [{}]);
  const email = u?.email ?? "";
  let [m] = await sql.query(`SELECT m.workspace_id FROM members m JOIN workspaces w ON w.id = m.workspace_id WHERE m.user_id = $1 AND w.kind = 'personal' LIMIT 1`, [owner_id]);
  if (!m) {
    const [w] = await sql.query(`INSERT INTO workspaces (name, kind, created_by) VALUES ($1, 'personal', $2) RETURNING id`, [`${u?.name || email.split("@")[0] || "My"}'s weddings`, owner_id]);
    await sql.query(`INSERT INTO members (workspace_id, user_id, email, role) VALUES ($1, $2, $3, 'owner')`, [w.id, owner_id, email]);
    m = { workspace_id: w.id };
  }
  await sql.query(`UPDATE weddings SET workspace_id = $1 WHERE owner_id = $2 AND workspace_id IS NULL`, [m.workspace_id, owner_id]);
}

// Backfill: weddings without pieces get the starter set.
const bare = await sql.query(`SELECT id, theme FROM weddings w WHERE NOT EXISTS (SELECT 1 FROM documents d WHERE d.wedding_id = w.id)`);
for (const w of bare) {
  await sql.query(
    `INSERT INTO documents (wedding_id, kind, layout, position) VALUES ($1,'invite','classic',0), ($1,'website','romance',1), ($1,'save','classic',2)`,
    [w.id],
  );
}
console.log(`✓ migrated (${statements.length} statements, ${owners.length} workspaces backfilled, ${bare.length} weddings seeded)`);
