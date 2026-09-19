import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Flightclaim — Your Journey. Your Rights." },
      { name: "description", content: "Flightclaim is an international flight complaint and compensation service fighting for passengers across every major aviation jurisdiction." },
      { property: "og:title", content: "About Flightclaim" },
      { property: "og:description", content: "Who we are and why we fight for passengers." },
      { property: "og:url", content: "https://jetclaim-assist.lovable.app/about" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jetclaim-assist.lovable.app/about" }],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHero title="About Us" subtitle="Your Journey. Your Rights." />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-muted-foreground sm:px-6">
        <p>
          Flightclaim was founded by frequent flyers who were tired of watching airlines quietly ignore
          the rights passengers already have. Compensation rules exist in almost every major
          aviation market — but they are written for lawyers, not travellers.
        </p>
        <p>
          We do the fighting. Our claims specialists know the trigger conditions, the deadlines and
          the enforcement bodies in each jurisdiction, and we pursue airlines on your behalf from
          first letter to final payout.
        </p>
        <p>
          Our fee is always agreed upfront before a claim proceeds, and if a claim does not succeed,
          you owe nothing. Over 98% of the eligible claims we take on end in compensation for the
          passenger.
        </p>
        <div className="grid gap-6 pt-6 sm:grid-cols-3">
          {[
            { stat: "2,500+", label: "Reviews from passengers" },
            { stat: "98%", label: "Success rate on eligible claims" },
            { stat: "8", label: "Regulatory frameworks covered" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-3xl font-extrabold text-navy">{item.stat}</p>
              <p className="mt-1 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
