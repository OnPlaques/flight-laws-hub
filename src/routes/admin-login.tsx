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
  head: () => ({ meta: [{ title: "Admin Login — JetClaim" }, { name: "description", content: "Secure JetClaim administration access." }, { property: "og:title", content: "Admin Login — JetClaim" }, { property: "og:description", content: "Secure JetClaim administration access." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});
function AdminLogin() {
  const login = useServerFn(adminLogin); const navigate = useNavigate();
  const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(""); const result = await login({ data: { password } }); setBusy(false); if (!result.ok) { setError("Incorrect password."); return; } navigate({ to: "/admin" }); }
  return <main className="grid min-h-screen place-items-center bg-surface px-4"><form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-border bg-card p-7 shadow-xl"><Logo className="justify-center" /><div className="mx-auto mt-8 flex size-12 items-center justify-center rounded-full bg-brand-blue-soft text-brand-blue"><LockKeyhole className="size-5" /></div><h1 className="mt-4 text-center text-2xl font-extrabold text-navy">Admin console</h1><p className="mt-1 text-center text-sm text-muted-foreground">Enter the shared access password.</p><div className="mt-6 space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus />{error ? <p className="text-sm text-destructive">{error}</p> : null}</div><Button type="submit" disabled={busy} className="mt-5 w-full bg-navy text-navy-foreground hover:bg-navy-deep">{busy ? <Loader2 className="size-4 animate-spin" /> : "Open console"}</Button></form></main>;
}
