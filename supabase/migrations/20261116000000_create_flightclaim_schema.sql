-- Claims submitted by passengers
create table public.claims (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('FC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null,
  email text not null,
  phone text,
  airline_name text not null,
  flight_number text not null,
  flight_date date not null,
  departure_airport text not null,
  arrival_airport text not null,
  issue_type text not null,
  description text,
  regulation_code text,
  status text not null default 'Submitted'
    check (status in ('Submitted','Under Review','Forwarded to Airline','Fee Pending','Awaiting Payout','Resolved','Closed')),
  compensation_amount numeric(12,2),
  compensation_currency text not null default 'USD',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Files attached to a claim (stored in the private claim-documents bucket)
create table public.claim_documents (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  file_size bigint not null,
  content_type text,
  created_at timestamptz not null default now()
);

-- People allowed into the admin console (must also exist in Supabase Auth)
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index claims_created_at_idx on public.claims (created_at desc);
create index claims_status_idx on public.claims (status);
create index claims_email_idx on public.claims (lower(email));
create index claim_documents_claim_id_idx on public.claim_documents (claim_id);

-- All access goes through the server using the service role, so nobody
-- else gets direct table access: RLS on, no policies, no grants.
alter table public.claims enable row level security;
alter table public.claim_documents enable row level security;
alter table public.admin_users enable row level security;

revoke all on public.claims, public.claim_documents, public.admin_users from anon, authenticated;
grant all on public.claims, public.claim_documents, public.admin_users to service_role;

-- Private bucket for uploaded claim documents (no public or client policies)
insert into storage.buckets (id, name, public)
values ('claim-documents', 'claim-documents', false)
on conflict (id) do nothing;
