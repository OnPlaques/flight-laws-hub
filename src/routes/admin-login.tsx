import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LockKeyhole, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/claim.functions";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin Login — Flightclaim" }, { name: "description", content: "Secure Flightclaim administration access." }, { property: "og:title", content: "Admin Login — Flightclaim" }, { property: "og:description", content: "Secure Flightclaim administration access." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});
function AdminLogin() {
  const login = useServerFn(adminLogin); const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(""); try { const result = await login({ data: { email, password } }); if (!result.ok) { setError("Incorrect email or password, or this account is not an admin."); return; } navigate({ to: "/admin" }); } catch { setError("Something went wrong. Please try again."); } finally { setBusy(false); } }
  return <main className="grid min-h-screen place-items-center bg-surface px-4"><form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-border bg-card p-7 shadow-xl"><Logo className="justify-center" /><div className="mx-auto mt-8 flex size-12 items-center justify-center rounded-full bg-brand-blue-soft text-brand-blue"><LockKeyhole className="size-5" /></div><h1 className="mt-4 text-center text-2xl font-extrabold text-navy">Admin console</h1><p className="mt-1 text-center text-sm text-muted-foreground">Sign in with your admin email and password.</p><div className="mt-6 space-y-4"><div className="space-y-2"><Label htmlFor="admin-email">Email</Label><Input id="admin-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus /></div><div className="space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />{error ? <p className="text-sm text-destructive">{error}</p> : null}</div></div><Button type="submit" disabled={busy} className="mt-5 w-full bg-navy text-navy-foreground hover:bg-navy-deep">{busy ? <Loader2 className="size-4 animate-spin" /> : "Open console"}</Button></form></main>;
}
