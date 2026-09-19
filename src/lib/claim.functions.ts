import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { admin?: boolean };

function getSessionConfig() {
  return {
    password: process.env['SESSION_SECRET']!,
    name: "jetclaim-admin",
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function safeMatch(input: string, expected: string) {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(getSessionConfig());
  if (!session.data.admin) throw new Response("Unauthorized", { status: 401 });
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().max(100) }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env['ADMIN_PASSWORD'];
    if (!expected || !safeMatch(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(getSessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(getSessionConfig());
  await session.clear();
  return { ok: true };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(getSessionConfig());
  return { admin: session.data.admin === true };
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
  .inputValidator((data) => claimSchema.parse(data))
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

export const updateClaimStatus = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ id: z.string().uuid(), status: z.enum(["Submitted", "Under Review", "Forwarded to Airline", "Awaiting Payout", "Resolved", "Closed"]) }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("claims").update({ status: data.status, updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
