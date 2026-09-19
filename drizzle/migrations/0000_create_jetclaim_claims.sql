CREATE TABLE public.claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('JC-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  airline_name text NOT NULL,
  flight_number text NOT NULL,
  flight_date date NOT NULL,
  departure_airport text NOT NULL,
  arrival_airport text NOT NULL,
  issue_type text NOT NULL,
  description text,
  regulation_code text,
  status text NOT NULL DEFAULT 'Submitted',
  compensation_amount numeric(12,2),
  compensation_currency text NOT NULL DEFAULT 'EUR',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.claims TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.claims TO authenticated;
GRANT ALL ON public.claims TO service_role;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit claims" ON public.claims FOR INSERT TO anon WITH CHECK (status = 'Submitted' AND internal_notes IS NULL AND compensation_amount IS NULL);

CREATE TABLE public.claim_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  content_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.claim_documents TO service_role;
ALTER TABLE public.claim_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX claims_created_at_idx ON public.claims (created_at DESC);
CREATE INDEX claims_status_idx ON public.claims (status);
CREATE INDEX claim_documents_claim_id_idx ON public.claim_documents (claim_id);