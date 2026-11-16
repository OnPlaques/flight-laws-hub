import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useSession, getRequest } from "@tanstack/react-start/server";

type AdminSession = { admin?: boolean; userId?: string; email?: string };

function getSessionConfig() {
  // The published/preview site renders inside a cross-site frame, so the cookie
  // must be SameSite=None + Secure there. Plain http (local dev) can't use that.
  let https = false;
  try {
    https = new URL(getRequest().url).protocol === "https:";
  } catch {
    https = false;
  }
  return {
    password: process.env['SESSION_SECRET']!,
    name: "flightclaim-admin",
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      secure: https,
      sameSite: (https ? "none" : "lax") as "none" | "lax",
      path: "/",
    },
  };
}

// An admin is a Supabase Auth user whose id is listed in public.admin_users.
// Checked on every request so removing someone from the table cuts access at once.
async function isActiveAdmin(userId?: string) {
  if (!userId) return false;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  return !!data;
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(getSessionConfig());
  if (!session.data.admin || !(await isActiveAdmin(session.data.userId))) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data) => z.object({ email: z.string().trim().email().max(255), password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Server is not configured.");
    const { createClient } = await import("@supabase/supabase-js");
    const authClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        // New-style publishable keys are not JWTs, so they must not be sent as a bearer token.
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
    const { data: auth, error } = await authClient.auth.signInWithPassword({ email: data.email, password: data.password });
    if (error || !auth.user) return { ok: false as const };
    if (!(await isActiveAdmin(auth.user.id))) return { ok: false as const };
    const session = await useSession<AdminSession>(getSessionConfig());
    await session.update({ admin: true, userId: auth.user.id, email: auth.user.email ?? data.email });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(getSessionConfig());
  await session.clear();
  return { ok: true };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(getSessionConfig());
  const admin = session.data.admin === true && (await isActiveAdmin(session.data.userId));
  return { admin, email: admin ? session.data.email ?? null : null };
});

const claimSchema = z.object({
  airline_name: z.string().trim().min(2).max(120),
  flight_number: z.string().trim().min(2).max(10),
  flight_date: z.string().min(4).max(20),
  departure_airport: z.string().trim().min(3).max(80),
  arrival_airport: z.string().trim().min(3).max(80),
  issue_type: z.string().min(2).max(40),
  description: z.string().max(2000).optional(),
  regulation_code: z.string().max(30).optional(),
  full_name: z.string().trim().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  files: z.array(z.object({ name: z.string().max(180), type: z.string().max(100), size: z.number().max(10 * 1024 * 1024), data: z.string() })).max(10),
});

export const submitClaim = createServerFn({ method: "POST" })
  .validator((data) => claimSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { files, ...claimData } = data;
    const { data: claim, error } = await supabaseAdmin.from("claims").insert({
      ...claimData,
      description: claimData.description ?? null,
      regulation_code: claimData.regulation_code ?? null,
      phone: claimData.phone ?? null,
      flight_number: claimData.flight_number.toUpperCase(),
    }).select("id,reference").single();
    if (error || !claim) throw new Error("Your claim could not be submitted. Please try again.");
    for (const file of files) {
      const bytes = Buffer.from(file.data, "base64");
      const path = `${claim.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const uploaded = await supabaseAdmin.storage.from("claim-documents").upload(path, bytes, { contentType: file.type || "application/octet-stream" });
      if (!uploaded.error) await supabaseAdmin.from("claim_documents").insert({ claim_id: claim.id, file_path: path, file_name: file.name, file_size: file.size, content_type: file.type || null });
    }
    return { reference: claim.reference };
  });

export const listAdminClaims = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("claims").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
});

export const CLAIM_FLOW = ["Submitted", "Under Review", "Forwarded to Airline", "Awaiting Payout", "Resolved", "Closed"] as const;
export type ClaimStage = typeof CLAIM_FLOW[number];

export const updateClaimStatus = createServerFn({ method: "POST" })
  .validator((data) => z.object({ id: z.string().uuid(), status: z.enum(CLAIM_FLOW) }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("claims").update({ status: data.status, updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const advanceClaim = createServerFn({ method: "POST" })
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: claim, error: readError } = await supabaseAdmin.from("claims").select("status").eq("id", data.id).single();
    if (readError || !claim) throw new Error("Claim not found.");
    const index = CLAIM_FLOW.indexOf(claim.status as ClaimStage);
    const next = CLAIM_FLOW[Math.min(index < 0 ? 1 : index + 1, CLAIM_FLOW.length - 1)]!;
    const { error } = await supabaseAdmin.from("claims").update({ status: next, updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) throw error;
    return { status: next };
  });

export const generateClaimLetter = createServerFn({ method: "POST" })
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: c, error } = await supabaseAdmin.from("claims").select("*").eq("id", data.id).single();
    if (error || !c) throw new Error("Claim not found.");
    const today = new Date().toISOString().slice(0, 10);
    const amount = c.compensation_amount ? `${c.compensation_currency} ${c.compensation_amount}` : "the full statutory amount due";
    const content = `FLIGHTCLAIM
Passenger compensation claim letter
Date: ${today}
Claim reference: ${c.reference}

To: ${c.airline_name} — Customer Relations / Legal Department

Subject: Compensation claim for flight ${c.flight_number} on ${c.flight_date} under ${c.regulation_code || "applicable air passenger rights law"}

Dear Sir or Madam,

We act on behalf of ${c.full_name} in respect of flight ${c.flight_number} from ${c.departure_airport} to ${c.arrival_airport}, scheduled on ${c.flight_date}.

The passenger's journey was affected by the following disruption: ${c.issue_type}.
${c.description ? `\nPassenger account of events:\n${c.description}\n` : ""}
On the basis of ${c.regulation_code || "the applicable air passenger rights regulation"}, the passenger is entitled to compensation of ${amount}, together with any reimbursable expenses arising from the disruption.

We therefore request that you:
1. Confirm receipt of this claim within 14 days.
2. Provide the operational reason for the disruption, with supporting documentation.
3. Settle the compensation due to the passenger via the details we will supply on confirmation.

Should the claim remain unanswered or be declined without a valid extraordinary-circumstances justification, we reserve the right to escalate the matter to the competent enforcement body, including the US Department of Transportation's Office of Aviation Consumer Protection where applicable, and to pursue legal remedies.

Passenger contact of record: ${c.email}${c.phone ? ` / ${c.phone}` : ""}
Current claim status: ${c.status}

Yours faithfully,

Claims Department
Flightclaim
`;
    return { fileName: `flightclaim-letter-${c.reference}.txt`, content };
  });

const trackSchema = z.object({ reference: z.string().trim().min(4).max(30), email: z.string().trim().email().max(255) });

export const trackClaim = createServerFn({ method: "POST" })
  .validator((data) => trackSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: claim } = await supabaseAdmin
      .from("claims")
      .select("reference,full_name,airline_name,flight_number,flight_date,departure_airport,arrival_airport,issue_type,regulation_code,status,compensation_amount,compensation_currency,created_at,updated_at")
      .eq("reference", data.reference.toUpperCase())
      .ilike("email", data.email)
      .maybeSingle();
    if (!claim) return { found: false as const };
    return { found: true as const, claim };
  });
