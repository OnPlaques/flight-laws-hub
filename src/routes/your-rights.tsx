import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/your-rights")({
  head: () => ({
    meta: [
      { title: "Your Air Passenger Rights — JetClaim" },
      { name: "description", content: "Plain-language guide to your rights after a delayed, cancelled or overbooked flight, region by region." },
      { property: "og:title", content: "Your Air Passenger Rights" },
      { property: "og:description", content: "What you are owed after a flight disruption, explained simply." },
      { property: "og:url", content: "https://jetclaim-assist.lovable.app/your-rights" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jetclaim-assist.lovable.app/your-rights" }],
  }),
  component: YourRights,
});

const RIGHTS = [
  { title: "Europe (EU261)", body: "If your flight arrived 3+ hours late, was cancelled with less than 14 days' notice, or you were denied boarding on an EU departure or an EU airline arrival, you can claim €250–€600 depending on distance. Airlines must also provide meals, communication and accommodation during long waits." },
  { title: "United Kingdom (UK261)", body: "The UK kept the EU rules after Brexit. Compensation runs from £220 to £520 on the same triggers: long delays, short-notice cancellations and denied boarding." },
  { title: "United States (DOT)", body: "US rules focus on refunds: if your flight is cancelled or significantly changed and you don't fly, you're owed a cash refund — not a voucher. Involuntary bumping can pay up to $2,150." },
  { title: "Canada (APPR)", body: "For disruptions within the airline's control you can claim up to C$1,000 for large carriers, plus rebooking, meals and accommodation." },
  { title: "India (DGCA)", body: "The DGCA Passenger Charter requires compensation up to ₹20,000 for cancellations without notice and denied boarding, plus refreshments during long delays." },
  { title: "Brazil (ANAC)", body: "ANAC Resolution 400 requires assistance from the first hour of delay and full reimbursement or rerouting after four hours." },
  { title: "Baggage worldwide (Montreal Convention)", body: "For international itineraries, airlines are liable for lost, damaged or delayed baggage up to roughly SDR 1,288 — report it before leaving the airport and keep your receipts." },
];

function YourRights() {
  return (
    <PageShell>
      <PageHero title="Your Rights" subtitle="What you're entitled to when your flight goes wrong — without the legal jargon." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-8">
          {RIGHTS.map((right) => (
            <article key={right.title} className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-navy">{right.title}</h2>
              <p className="mt-2 text-muted-foreground">{right.body}</p>
            </article>
          ))}
        </div>
        <Button asChild className="mt-10 bg-navy text-navy-foreground hover:bg-navy-deep">
          <Link to="/claim">Check my claim</Link>
        </Button>
      </section>
    </PageShell>
  );
}
