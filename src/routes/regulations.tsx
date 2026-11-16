import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Globe2, Plane, ShieldCheck } from "lucide-react";
import { PageHero, PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { REGULATION_DETAILS, type RegulationDetail } from "@/lib/jetclaim";

export const Route = createFileRoute("/regulations")({
  head: () => ({
    meta: [
      { title: "International Aviation Regulations We Cover — Flightclaim" },
      { name: "description", content: "All 8 passenger-rights regimes Flightclaim works with: EU261, UK261, US DOT, Canada APPR, India DGCA, Brazil ANAC, Turkey SHY and the Montreal Convention." },
      { property: "og:title", content: "International Aviation Regulations We Cover" },
      { property: "og:description", content: "Trigger conditions, coverage, compensation amounts and claim deadlines across eight passenger-rights regimes." },
      { property: "og:url", content: "https://flight-laws-hub.lovable.app/regulations" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://flight-laws-hub.lovable.app/regulations" }],
  }),
  component: Regulations,
});

function Regulations() {
  const regional = REGULATION_DETAILS.filter((r) => r.code !== "MONTREAL").sort(
    (a, b) => Number(b.code === "USDOT") - Number(a.code === "USDOT"),
  );
  const montreal = REGULATION_DETAILS.find((r) => r.code === "MONTREAL");

  return (
    <PageShell>
      <PageHero
        title="International Aviation Regulations We Cover"
        subtitle="Flightclaim checks every claim against the regulation that applies to your route and airline."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {regional.map((reg) => (
            <RegulationCard key={reg.code} reg={reg} />
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-brand-blue/25 bg-brand-blue/5 p-5">
          <p className="text-sm text-foreground/90">
            <strong className="text-navy">Applies in addition, not instead.</strong> The Montreal Convention sits on
            top of whichever regional regulation covers your flight — it does not replace EU261, UK261 or the others.
            It specifically governs baggage that is lost, delayed or damaged.
          </p>
        </div>

        <div className="mt-6">
          {montreal ? <RegulationCard reg={montreal} /> : null}
        </div>

        <p className="mt-12 rounded-lg border border-border bg-surface px-4 py-3 text-xs text-muted-foreground">
          Regulation details are provided for informational purposes. Actual eligibility is confirmed by Flightclaim after
          reviewing your specific claim.
        </p>
      </section>
    </PageShell>
  );
}

function RegulationCard({ reg }: { reg: RegulationDetail }) {
  return (
    <Card id={reg.code.toLowerCase()} className="h-full scroll-mt-24 border-border">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-navy px-2.5 py-1.5 text-xs font-bold tracking-wide text-navy-foreground">
            {reg.chip}
          </span>
          <div>
            <h2 className="text-lg font-extrabold leading-tight text-navy">{reg.name}</h2>
            <p className="text-xs text-muted-foreground">{reg.region}</p>
          </div>
        </div>

        <Detail icon={<Plane className="size-4 text-brand-blue" />} label="Applies to" value={reg.appliesTo} />
        <Detail icon={<ShieldCheck className="size-4 text-brand-blue" />} label="What's covered" value={reg.covers} />
        <Detail icon={<Globe2 className="size-4 text-brand-blue" />} label="Compensation" value={reg.compensation} highlight />
        <Detail icon={<CalendarClock className="size-4 text-brand-blue" />} label="Claim deadline" value={reg.deadline} />

        <div className="mt-auto pt-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/claim">Check if I qualify <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={highlight ? "text-sm font-semibold text-brand-blue" : "text-sm text-foreground/90"}>{value}</p>
      </div>
    </div>
  );
}
