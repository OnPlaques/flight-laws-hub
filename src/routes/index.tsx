import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Clock, FileText, Headphones, ListChecks, Lock, Plane, Search, ShieldCheck, Users, WalletCards, XCircle } from "lucide-react";
import heroImage from "@/assets/flightclaim-professional-hero.jpg";
import wingImage from "@/assets/flightclaim-wing.jpg";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIRPORT_GROUPS, REGULATION_BADGES } from "@/lib/jetclaim";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Flightclaim — US Flight Refunds & Compensation" },
    { name: "description", content: "Flightclaim helps US travelers claim refunds and compensation for cancelled, significantly changed and overbooked flights under US DOT rules." },
    { property: "og:title", content: "Flightclaim — Your Flight. Your Rights." },
    { property: "og:description", content: "Check your US flight and start a refund or compensation claim in minutes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

const featuredAirline = {
  name: "American Airlines",
  logo: "/airlines/american-logo.png",
  hubs: "Dallas/Fort Worth, Charlotte, Chicago O’Hare, Philadelphia, Phoenix and Miami",
};

const otherAirlines = [
  { name: "Delta Air Lines", logo: "/airlines/delta-logo.png", wordmark: true },
  { name: "United Airlines", logo: "/airlines/united-logo.png", wordmark: true },
  { name: "Southwest Airlines", logo: "/airlines/southwest-logo.png", wordmark: true },
  { name: "JetBlue", logo: "/airlines/jetblue-logo.png", wordmark: true },
  { name: "Alaska Airlines", logo: "/airlines/generic-plane.svg", wordmark: false },
  { name: "Spirit Airlines", logo: "/airlines/spirit-logo.png", wordmark: true },
  { name: "Frontier Airlines", logo: "/airlines/frontier-logo.png", wordmark: true },
  { name: "Hawaiian Airlines", logo: "/airlines/hawaiian-logo.png", wordmark: true },
  { name: "Allegiant Air", logo: "/airlines/allegiant-logo.png", wordmark: true },
];

const claimTypes = [
  { icon: XCircle, title: "Cancelled flights", outcome: "A full refund", body: "If the airline cancels and you choose not to take the rebooking, the ticket price goes back to your original form of payment." },
  { icon: Clock, title: "Significant changes", outcome: "A full refund", body: "A schedule change of 3 hours or more on domestic flights, or 6 hours or more on international ones, can entitle you to your money back." },
  { icon: Users, title: "Bumped from a flight", outcome: "Up to $2,150", body: "Denied boarding on an oversold flight can mean 200% to 400% of your one-way fare, depending on how late you arrive." },
  { icon: BriefcaseBusiness, title: "Delayed baggage", outcome: "Your bag fee back", body: "If your checked bag is badly delayed, the fee you paid to check it can be refunded." },
];

const steps = [
  { icon: Search, title: "Check eligibility", body: "Enter your flight details to see if you qualify." },
  { icon: FileText, title: "We prepare your claim", body: "We collect the information and documents needed." },
  { icon: ShieldCheck, title: "We deal with the airline", body: "We submit the claim and follow it up for you." },
  { icon: WalletCards, title: "You get paid", body: "Approved refunds and compensation come directly to you." },
];

const reasons = [
  { icon: Headphones, title: "Real people", body: "A support team that answers, not a chatbot." },
  { icon: ListChecks, title: "The right rule, every time", body: "We tell you which US DOT rule applies to your flight." },
  { icon: Search, title: "Track every step", body: "Follow your claim any time with your reference number." },
];

function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{title}</h2>
      {sub ? <p className="mt-3 text-base leading-relaxed text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();
  const [flight, setFlight] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState("");
  function check(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/claim", search: { flight: flight || undefined, date: date || undefined, from: departure || undefined, issue: undefined, airline: undefined } });
  }

  return (
    <PageShell>
      {/* 1. Hero — the one place to check a flight */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <img src={heroImage} alt="Traveler at an airport gate with an aircraft outside the window" width={1536} height={864} decoding="async" fetchPriority="high" className="absolute inset-0 size-full object-cover object-[64%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/15" />
        <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.82fr]">
          <div className="max-w-xl text-navy">
            <h1 className="text-4xl font-extrabold leading-[1.12] sm:text-5xl lg:text-[3.45rem]">
              Flight cancelled, bumped or delayed?
              <span className="mt-2 block text-brand-blue">You could be owed a refund or compensation.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-navy/75">
              Flightclaim helps US travelers claim what they are entitled to under US DOT rules, quickly and without the hassle.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
              <li className="flex items-center gap-2"><ShieldCheck className="size-5 text-brand-blue" />No win, no fee</li>
              <li className="flex items-center gap-2"><Plane className="size-5 text-brand-blue" />Built for US flyers</li>
            </ul>
          </div>
          <form onSubmit={check} className="ml-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl sm:p-7">
            <h2 className="text-2xl font-extrabold text-navy">Check your flight</h2>
            <p className="mt-1 text-sm text-muted-foreground">See if you qualify in under 2 minutes.</p>
            <div className="mt-5 space-y-3">
              <div className="relative"><Plane className="absolute left-3 top-3 size-4 text-brand-blue" /><Input aria-label="Flight number" className="pl-10" placeholder="Flight number (e.g. AA100)" value={flight} onChange={(e) => setFlight(e.target.value)} /></div>
              <div className="relative"><CalendarDays className="absolute left-3 top-3 size-4 text-brand-blue" /><Input aria-label="Date of flight" className="pl-10" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <Select value={departure} onValueChange={setDeparture}>
                <SelectTrigger aria-label="Departure airport"><SelectValue placeholder="Departure airport" /></SelectTrigger>
                <SelectContent>{AIRPORT_GROUPS.flatMap((g) => g.airports).map((a) => <SelectItem key={a.iata} value={`${a.city} (${a.iata})`}>{a.city} ({a.iata})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button type="submit" className="mt-4 w-full gap-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue/90">Check eligibility <ArrowRight className="size-4" /></Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground"><Lock className="size-3" />Your information is safe and secure.</p>
          </form>
        </div>
      </section>

      {/* 2. Airlines — the one place airlines appear; each opens the claim form with the airline filled in */}
      <section className="bg-background py-20" aria-labelledby="airlines-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="Start with your airline" title="Which airline let you down?" sub="Choose your airline and we open the claim form with it already filled in." />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.45fr]">
            <Link
              to="/claim"
              search={{ airline: featuredAirline.name }}
              aria-label={`Start a claim for ${featuredAirline.name}`}
              className="group flex flex-col justify-between gap-8 rounded-2xl bg-navy-deep p-8 text-navy-foreground transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              <div>
                <div className="grid h-24 w-48 place-items-center rounded-lg bg-white p-4">
                  <img src={featuredAirline.logo} alt={featuredAirline.name} loading="lazy" className="max-h-full w-auto object-contain" />
                </div>
                <p className="mt-8 text-xs font-bold uppercase tracking-widest text-navy-foreground/60">Featured airline</p>
                <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">Flying with American Airlines?</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-foreground/75">We handle claims for cancelled, significantly changed and overbooked American Airlines flights, including trips through {featuredAirline.hubs}.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold">Start your American Airlines claim <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {otherAirlines.map((airline) => (
                <Link
                  key={airline.name}
                  to="/claim"
                  search={{ airline: airline.name }}
                  aria-label={`Start a claim for ${airline.name}`}
                  className="group flex min-h-28 items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-5 transition-all hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  {airline.wordmark ? (
                    <img src={airline.logo} alt={airline.name} loading="lazy" className="h-11 w-auto max-w-[150px] object-contain mix-blend-multiply" />
                  ) : (
                    <>
                      <img src={airline.logo} alt="" width={32} height={32} loading="lazy" className="size-8 shrink-0 object-contain opacity-75 transition group-hover:opacity-100" />
                      <span className="text-sm font-bold leading-tight text-navy transition-colors group-hover:text-brand-blue">{airline.name}</span>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Flying with another airline? Pick it in the claim form. Flightclaim is an independent service and is not affiliated with any airline.</p>
        </div>
      </section>

      {/* 3. What you can claim — the one place money amounts appear */}
      <section className="border-y border-border bg-surface py-20" aria-labelledby="claims-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead center eyebrow="What you can claim" title="Four situations that can put money back" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {claimTypes.map((item) => (
              <article key={item.title} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="grid size-12 place-items-center rounded-full bg-brand-blue-soft text-brand-blue"><item.icon className="size-6" /></span>
                <h3 className="mt-5 text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-1 text-xl font-extrabold text-brand-blue">{item.outcome}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">US rules do not require cash compensation for delays alone. Rules and dollar limits are set by the US Department of Transportation and can change, so we confirm eligibility on every claim.</p>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="bg-background py-20" aria-labelledby="how-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead center eyebrow="Simple process" title="How Flightclaim works" />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, i) => (
              <li key={item.title} className="relative text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-surface text-brand-blue"><item.icon className="size-6" /></span>
                <span className="absolute left-1/2 top-0 ml-4 grid size-6 place-items-center rounded-full bg-brand-blue text-xs font-bold text-primary-foreground">{i + 1}</span>
                <h3 className="mt-5 text-base font-bold text-navy">{item.title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Why Flightclaim */}
      <section className="bg-surface py-20" aria-labelledby="why-title">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl">
            <img src={wingImage} alt="Aircraft wing above the clouds at sunrise" width={1024} height={640} loading="lazy" className="aspect-[16/10] w-full object-cover" />
          </div>
          <div>
            <SectionHead eyebrow="Why Flightclaim" title="Your rights. Our priority." sub="A small team with one job: getting you what you are owed." />
            <ul className="mt-8 space-y-6">
              {reasons.map((r) => (
                <li key={r.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-blue-soft text-brand-blue"><r.icon className="size-5" /></span>
                  <div>
                    <h3 className="text-base font-bold text-navy">{r.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Rules we work under */}
      <section className="bg-background py-16" aria-labelledby="rules-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <SectionHead eyebrow="Rules we work under" title="One service, every major flight law" />
            <Link to="/regulations" className="flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:underline">Read the full guide <ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REGULATION_BADGES.map((reg) => (
              <Link
                key={reg.code}
                to="/regulations"
                hash={reg.code.toLowerCase()}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden="true">{reg.flag}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold text-navy group-hover:text-brand-blue">{reg.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{reg.detail}</span>
                </span>
                <ArrowRight className="ml-auto size-4 shrink-0 text-brand-blue" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing call to action */}
      <section className="bg-navy-deep py-16 text-navy-foreground" aria-labelledby="final-cta-title">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <h2 id="final-cta-title" className="text-3xl font-extrabold sm:text-4xl">Ready to find out what you’re owed?</h2>
          <p className="max-w-xl text-sm leading-relaxed text-navy-foreground/75">It takes less than 3 minutes to start your claim.</p>
          <Button asChild size="lg" className="gap-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue/90"><Link to="/claim">Start your claim <ArrowRight className="size-4" /></Link></Button>
        </div>
      </section>
    </PageShell>
  );
}
