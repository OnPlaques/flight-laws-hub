import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Circle, Loader2, PlaneTakeoff, Search } from "lucide-react";
import { trackClaim, CLAIM_FLOW } from "@/lib/claim.functions";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Claim — Flightclaim" },
      { name: "description", content: "Follow your Flightclaim compensation claim step by step with your reference number and email." },
      { property: "og:title", content: "Track Your Claim — Flightclaim" },
      { property: "og:description", content: "See exactly which stage your flight compensation claim has reached." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

type Claim = Extract<Awaited<ReturnType<typeof trackClaim>>, { found: true }>["claim"];

const STAGE_COPY: Record<string, string> = {
  Submitted: "We have received your claim and your documents.",
  "Under Review": "Our team is checking your flight against the applicable regulation.",
  "Forwarded to Airline": "Your formal claim letter has been sent to the airline.",
  "Awaiting Payout": "The airline has accepted the claim and payment is being arranged.",
  Resolved: "Compensation has been secured and paid out.",
  Closed: "This case has been closed.",
};

function TrackPage() {
  const track = useServerFn(trackClaim);
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [claim, setClaim] = useState<Claim | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function lookup(showSpinner = true) {
    if (showSpinner) setBusy(true);
    setError("");
    try {
      const result = await track({ data: { reference, email } });
      if (!result.found) {
        setClaim(null);
        setError("We could not find a claim with that reference and email.");
      } else {
        setClaim(result.claim);
      }
    } catch {
      setError("Please check your reference number and email address.");
    } finally {
      setBusy(false);
    }
  }

  // Live updates: while a claim is on screen, re-check its stage every 10 seconds.
  useEffect(() => {
    if (!claim) return;
    const id = setInterval(() => void lookup(false), 10000);
    return () => clearInterval(id);
  }, [claim?.reference, reference, email]);

  const currentIndex = claim ? Math.max(CLAIM_FLOW.indexOf(claim.status as (typeof CLAIM_FLOW)[number]), 0) : -1;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">Claim tracker</p>
        <h1 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">Track your claim</h1>
        <p className="mt-3 text-muted-foreground">
          Enter your claim reference and the email you used. Your progress updates automatically as our team moves your case forward.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void lookup();
          }}
          className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="track-ref">Claim reference</Label>
            <Input id="track-ref" placeholder="FC-XXXXXXXX" value={reference} onChange={(e) => setReference(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="track-email">Email address</Label>
            <Input id="track-email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" disabled={busy} className="bg-navy text-navy-foreground hover:bg-navy-deep">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <><Search className="size-4" /> Track</>}
          </Button>
        </form>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        {claim ? (
          <section className="mt-10 overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Reference</p>
                <p className="text-lg font-extrabold text-brand-blue">{claim.reference}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Current stage</p>
                <p className="font-bold text-navy">{claim.status}</p>
              </div>
            </div>

            <div className="grid gap-1 px-5 py-5 text-sm sm:grid-cols-2">
              <p className="text-muted-foreground">Passenger</p>
              <p className="font-semibold text-navy sm:text-right">{claim.full_name}</p>
              <p className="text-muted-foreground">Flight</p>
              <p className="font-semibold text-navy sm:text-right">
                {claim.airline_name} {claim.flight_number} · {claim.flight_date}
              </p>
              <p className="text-muted-foreground">Route</p>
              <p className="font-semibold text-navy sm:text-right">
                {claim.departure_airport} → {claim.arrival_airport}
              </p>
              <p className="text-muted-foreground">Disruption</p>
              <p className="font-semibold text-navy sm:text-right">{claim.issue_type}</p>
              <p className="text-muted-foreground">Regulation</p>
              <p className="font-semibold text-navy sm:text-right">{claim.regulation_code || "Under review"}</p>
              {claim.compensation_amount ? (
                <>
                  <p className="text-muted-foreground">Compensation</p>
                  <p className="font-semibold text-navy sm:text-right">
                    {claim.compensation_currency} {claim.compensation_amount}
                  </p>
                </>
              ) : null}
            </div>

            <ol className="border-t border-border px-5 py-6">
              {CLAIM_FLOW.map((stage, i) => {
                const done = i <= currentIndex;
                const active = i === currentIndex;
                return (
                  <li key={stage} className="flex gap-3 pb-5 last:pb-0">
                    <div className="flex flex-col items-center">
                      {done ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground/50" />}
                      {i < CLAIM_FLOW.length - 1 ? <span className={`mt-1 w-px flex-1 ${done ? "bg-success/50" : "bg-border"}`} /> : null}
                    </div>
                    <div className="pb-1">
                      <p className={`text-sm font-bold ${active ? "text-brand-blue" : done ? "text-navy" : "text-muted-foreground"}`}>{stage}</p>
                      <p className="text-sm text-muted-foreground">{STAGE_COPY[stage]}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="flex items-center gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <PlaneTakeoff className="size-4" /> This page refreshes on its own, so you always see the latest stage.
            </p>
          </section>
        ) : null}

        <Link to="/claim" className="mt-10 inline-block text-sm font-semibold text-brand-blue">
          Start a new claim
        </Link>
      </div>
    </PageShell>
  );
}
