import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Flightclaim" },
      { name: "description", content: "Terms for using Flightclaim flight compensation assessment and claim services." },
      { property: "og:title", content: "Terms of Service — Flightclaim" },
      { property: "og:description", content: "Terms for using Flightclaim services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PageShell>
      <PageHero title="Terms of Service" subtitle="The terms that apply when you use Flightclaim." />
      <section className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-7 text-muted-foreground sm:px-6">
        <div><h2 className="text-lg font-bold text-navy">Eligibility checks</h2><p className="mt-2">Initial results are estimates based on the information supplied. Final eligibility depends on the route, airline, disruption and available evidence.</p></div>
        <div><h2 className="text-lg font-bold text-navy">Claim service</h2><p className="mt-2">Before Flightclaim proceeds with a case, the service scope and any applicable fee will be clearly agreed with you.</p></div>
        <div><h2 className="text-lg font-bold text-navy">Your information</h2><p className="mt-2">You agree to provide complete and accurate information and to notify us if relevant circumstances change.</p></div>
        <div><h2 className="text-lg font-bold text-navy">No legal advice</h2><p className="mt-2">Flightclaim provides claim support and is not a law firm. Information on this website is general and does not constitute legal advice.</p></div>
      </section>
    </PageShell>
  );
}