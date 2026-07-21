-- StrataSnap — Supabase schema
-- Run this in Supabase → SQL Editor → New query

-- ────────────────────────────────────────────────────────────
-- CUSTOMERS: one row per email address that has ever purchased
-- ────────────────────────────────────────────────────────────

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  total_spent_cents integer default 0,
  credits_remaining integer default 0,
  credits_purchased integer default 0,
  credits_used integer default 0,
  notes text
);

create index if not exists customers_email_idx on customers(email);

-- ────────────────────────────────────────────────────────────
-- PURCHASES: one row per Stripe checkout completion
-- ────────────────────────────────────────────────────────────

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default now(),
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  amount_cents integer not null,
  currency text default 'aud',
  tier text not null,  -- 'single' | 'fivepack' | 'tenpack' | 'conveyancer'
  credits_granted integer not null,
  status text default 'completed'  -- 'completed' | 'refunded'
);

create index if not exists purchases_customer_id_idx on purchases(customer_id);
create index if not exists purchases_email_idx on purchases(email);

-- ────────────────────────────────────────────────────────────
-- REPORTS: one row per strata document processed
-- ────────────────────────────────────────────────────────────

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default now(),
  property_address text,
  strata_plan_number text,
  original_filename text,
  summary_json jsonb,
  pdf_url text,
  status text default 'processing',  -- 'processing' | 'completed' | 'failed'
  error_message text,
  scheduled_deletion_at timestamp with time zone default (now() + interval '30 days')
);

create index if not exists reports_customer_id_idx on reports(customer_id);
create index if not exists reports_email_idx on reports(email);
create index if not exists reports_scheduled_deletion_idx on reports(scheduled_deletion_at);

-- ────────────────────────────────────────────────────────────
-- MAGIC LINKS: for passwordless login to view past reports
-- ────────────────────────────────────────────────────────────

create table if not exists magic_links (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text unique not null,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null,
  used_at timestamp with time zone,
  ip_address text
);

create index if not exists magic_links_token_idx on magic_links(token);
create index if not exists magic_links_email_idx on magic_links(email);

-- ────────────────────────────────────────────────────────────
-- CONVEYANCER LEADS: form submissions from /conveyancers page
-- ────────────────────────────────────────────────────────────

create table if not exists conveyancer_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  firm_name text not null,
  contact_name text not null,
  contact_email text not null,
  phone text,
  estimated_monthly_reports integer,
  notes text,
  status text default 'new'  -- 'new' | 'contacted' | 'demo_sent' | 'signed' | 'declined'
);

-- ────────────────────────────────────────────────────────────
-- BUYERS AGENT LEADS: form submissions from /buyers-agents page
-- ────────────────────────────────────────────────────────────

create table if not exists buyers_agent_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  firm_name text not null,
  contact_name text not null,
  contact_email text not null,
  phone text,
  estimated_monthly_reports integer,
  notes text,
  status text default 'new'
);

-- ────────────────────────────────────────────────────────────
-- Row Level Security (RLS)
-- Everything is accessed via service_role key from server-side only.
-- No public access to any table.
-- ────────────────────────────────────────────────────────────

alter table customers enable row level security;
alter table purchases enable row level security;
alter table reports enable row level security;
alter table magic_links enable row level security;
alter table conveyancer_leads enable row level security;
alter table buyers_agent_leads enable row level security;

-- Auto-update updated_at on customers table
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger customers_updated_at
  before update on customers
  for each row
  execute function update_updated_at();
