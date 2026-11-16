import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock, FileText, Headphones, Lock, Plane, Search, ShieldCheck, Users, WalletCards, XCircle } from "lucide-react";
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
    { name: "description", content: "Flightclaim helps US travelers claim refunds and compensation for cancelled, significantly delayed and overbooked flights under US DOT rules." },
    { property: "og:title", content: "Flightclaim — Your Flight. Your Rights." },
    { property: "og:description", content: "Check your US flight and start a refund or compensation claim in minutes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

const disruptionTypes = [
  { icon: XCircle, title: "Flight Cancellations", body: "You are owed a cash refund if your flight is cancelled and you choose not to take the rebooking." },
  { icon: Clock, title: "Significant Changes", body: "A schedule change of 3+ hours (domestic) or 6+ hours (international) can qualify you for a refund." },
  { icon: Users, title: "Overbooking", body: "If you are bumped from an oversold flight, you may be owed 200% to 400% of your one-way fare." },
  { icon: BriefcaseBusiness, title: "Delayed Baggage", body: "Get your checked bag fee back when your bag is badly delayed." },
];
const steps = [
  { icon: Search, title: "Check Eligibility", body: "Enter your flight details to find out if you qualify." },
  { icon: FileText, title: "We Handle the Paperwork", body: "Our team collects the information needed to submit your claim." },
  { icon: ShieldCheck, title: "We Negotiate", body: "We deal with the airline on your behalf to get the best result." },
  { icon: WalletCards, title: "You Get Paid", body: "Once approved, your refund or compensation is paid directly to you." },
];
const rights = [
  { title: "Automatic refunds", body: "Airlines must refund cancelled or significantly changed flights to your original form of payment, within 7 business days for card payments, without you having to ask." },
  { title: "Bumped from a flight", body: "Denied boarding on an oversold flight can mean 200% to 400% of your one-way fare, up to $2,150, depending on how late you arrive." },
  { title: "Tarmac delays", body: "Domestic flights cannot be held on the ground for more than 3 hours, and international flights for 4 hours, without a chance to get off, apart from limited safety exceptions." },
];

const featuredAirlines = [
  { name: "American Airlines", logo: "/airlines/american-logo.png", wordmark: true },
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

function Landing() {
  const navigate = useNavigate();
  const [flight, setFlight] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState("");
  function check(e: React.FormEvent) { e.preventDefault(); navigate({ to: "/claim", search: { flight: flight || undefined, date: date || undefined, issue: undefined } }); }

  return <PageShell>
    <section className="relative isolate overflow-hidden border-b border-border">
      <img src={heroImage} alt="Professional traveler at an international airport with an aircraft at the gate" width={1536} height={864} decoding="async" fetchPriority="high" className="absolute inset-0 size-full object-cover object-[64%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/15" />
      <div className="relative mx-auto grid min-h-[590px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.82fr]">
        <div className="max-w-xl text-navy">
          <h1 className="text-4xl font-extrabold leading-[1.12] sm:text-5xl lg:text-[3.45rem]">Flight Cancelled?<br />Bumped? Delayed?<br /><span className="text-brand-blue">You could be owed a refund or compensation.</span></h1>
          <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-navy/75">Flightclaim helps US travelers claim the refunds and compensation they are entitled to under US DOT rules — quickly, easily and hassle-free.</p>
          <ul className="mt-8 flex flex-wrap gap-6 text-xs font-bold sm:text-sm">{[[ShieldCheck,"No win, no fee"],[Plane,"Fast & simple process"],[Users,"Built for US flyers"]].map(([Icon,label]) => { const I=Icon as typeof Plane; return <li key={String(label)} className="flex items-center gap-2"><I className="size-5 text-brand-blue" />{String(label)}</li>; })}</ul>
          <Link to="/claim" className="mt-8 inline-flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition hover:border-brand-blue/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            <img src="/airlines/american-logo.png" alt="American Airlines" className="h-10 w-auto object-contain" />
            <span className="flex items-center gap-2 border-l border-border pl-4 text-sm font-bold text-navy">Flying American? Start your claim <ArrowRight className="size-4 text-brand-blue" /></span>
          </Link>
        </div>
        <form onSubmit={check} className="ml-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl sm:p-7">
          <h2 className="text-2xl font-extrabold text-navy">Check Your Flight</h2><p className="mt-1 text-sm text-muted-foreground">See if you’re eligible for a refund or compensation in less than 2 minutes.</p>
          <div className="mt-5 space-y-3"><div className="relative"><Plane className="absolute left-3 top-3 size-4 text-brand-blue"/><Input aria-label="Flight number" className="pl-10" placeholder="Flight number (e.g. AA100)" value={flight} onChange={e=>setFlight(e.target.value)} /></div><div className="relative"><CalendarDays className="absolute left-3 top-3 size-4 text-brand-blue"/><Input aria-label="Date of flight" className="pl-10" type="date" value={date} onChange={e=>setDate(e.target.value)} /></div><Select value={departure} onValueChange={setDeparture}><SelectTrigger aria-label="Departure airport"><SelectValue placeholder="Departure airport" /></SelectTrigger><SelectContent>{AIRPORT_GROUPS.flatMap(g=>g.airports).map(a=><SelectItem key={a.iata} value={`${a.city} (${a.iata})`}>{a.city} ({a.iata})</SelectItem>)}</SelectContent></Select></div>
          <Button type="submit" className="mt-4 w-full gap-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue/90">Check Eligibility <ArrowRight className="size-4"/></Button><p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground"><Lock className="size-3"/>Your information is safe and secure.</p>
        </form>
      </div>
    </section>

    <section className="border-b border-border bg-background py-8" aria-labelledby="featured-airlines-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-1 text-center sm:flex-row sm:items-baseline sm:justify-center sm:gap-2">
          <h2 id="featured-airlines-title" className="text-sm font-extrabold text-navy">Claims across major US airlines</h2>
          <p className="text-xs text-muted-foreground">Select an airline to start checking your flight</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-5">
          {featuredAirlines.map((airline) => (
            <Link
              key={airline.name}
              to="/claim"
              aria-label={`Start a claim for ${airline.name}`}
              className="group flex min-h-24 items-center justify-center gap-3 bg-card px-3 py-4 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-inset"
            >
              {airline.wordmark ? (
                <img src={airline.logo} alt={airline.name} loading="lazy" className="h-11 w-auto max-w-[150px] object-contain mix-blend-multiply" />
              ) : (
                <>
                  <img src={airline.logo} alt="" width={36} height={36} loading="lazy" className="size-8 shrink-0 object-contain opacity-75 transition group-hover:opacity-100" />
                  <span className="text-sm font-bold leading-tight text-navy transition-colors group-hover:text-brand-blue">{airline.name}</span>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-navy-deep py-12 text-navy-foreground" aria-labelledby="american-title">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
        <div className="grid h-24 w-44 shrink-0 place-items-center rounded-lg bg-white p-4"><img src="/airlines/american-logo.png" alt="American Airlines" loading="lazy" className="max-h-full w-auto object-contain" /></div>
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-navy-foreground/60">Featured airline</p>
          <h2 id="american-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">Flying with American Airlines?</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-foreground/75">We help passengers file claims for cancelled, significantly changed and overbooked American Airlines flights, including trips through Dallas/Fort Worth, Charlotte, Chicago O’Hare, Philadelphia, Phoenix, Miami, Los Angeles, New York and Washington National.</p>
          <p className="mt-3 text-xs text-navy-foreground/55">Flightclaim is an independent service and is not affiliated with American Airlines or any other airline.</p>
        </div>
        <Button asChild className="gap-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue/90"><Link to="/claim">Check my American Airlines flight <ArrowRight className="size-4"/></Link></Button>
      </div>
    </section>

    <section className="bg-surface py-16"><div className="mx-auto max-w-7xl px-4 text-center sm:px-6"><p className="font-bold text-navy">You could be owed up to</p><p className="mt-1 text-5xl font-extrabold text-brand-blue">$2,150</p><p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground">when you are bumped from an oversold flight, depending on your fare and how late you arrive. US rules do not require cash compensation for delays alone, so we focus on the refunds and payments you can actually claim.</p><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{disruptionTypes.map((item,i)=><div key={item.title} className={i ? "border-border lg:border-l lg:pl-8" : ""}><span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-blue-soft text-brand-blue"><item.icon className="size-6"/></span><h3 className="mt-4 font-bold text-navy">{item.title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{item.body}</p></div>)}</div></div></section>

    <section className="border-y border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase text-brand-blue">Your flight may be protected</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy">Regulations we cover</h2>
          </div>
          <Link to="/regulations" className="flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:underline">View all flight laws <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-7 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 md:grid-cols-4">
          {REGULATION_BADGES.map((reg) => (
            <Link
              key={reg.label}
              to="/regulations"
              hash={reg.code.toLowerCase()}
              className="group flex min-w-56 items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-md sm:min-w-0"
            >
              <span className="text-2xl" aria-hidden="true">{reg.flag}</span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-navy group-hover:text-brand-blue">{reg.label}</span>
                <span className="mt-1 block text-xs leading-snug text-muted-foreground">{reg.detail}</span>
              </span>
              <ArrowRight className="ml-auto size-4 shrink-0 text-brand-blue" />
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="py-18"><div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.5fr]"><div><p className="text-xs font-bold uppercase text-brand-blue">Simple process</p><h2 className="mt-2 text-3xl font-extrabold text-navy">How Flightclaim Works</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">We handle the complex process so you don’t have to. From checking eligibility to getting your refund or compensation, we’re with you every step of the way.</p><Button asChild className="mt-6 gap-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue/90"><Link to="/claim">Start Your Claim <ArrowRight className="size-4"/></Link></Button></div><div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">{steps.map((item,i)=><div key={item.title} className="relative text-center"><span className="absolute right-0 top-0 grid size-7 place-items-center rounded-full bg-brand-blue text-xs font-bold text-primary-foreground">{i+1}</span><span className="mx-auto grid size-14 place-items-center rounded-full bg-surface text-brand-blue"><item.icon className="size-6"/></span><h3 className="mt-4 text-sm font-bold text-navy">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.body}</p></div>)}</div></div></section>

    <section className="bg-surface py-16"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2"><div className="relative overflow-hidden rounded-lg"><img src={wingImage} alt="Aircraft wing above clouds at sunrise" width={1024} height={640} loading="lazy" className="aspect-[16/9] w-full object-cover"/><p className="absolute bottom-5 left-6 max-w-[10ch] -rotate-6 text-2xl font-bold italic text-primary-foreground drop-shadow">Your journey matters.</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Why choose Flightclaim</p><h2 className="mt-2 text-3xl font-extrabold text-navy">Your Rights. Our Priority.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">We’re a dedicated team of travel experts with a simple mission — to help you get what you’re owed.</p><div className="mt-7 grid gap-6 sm:grid-cols-2">{[[Headphones,"Expert Support","Real people, not bots. We’re here to help."],[ShieldCheck,"Clear Next Steps","We tell you which US DOT rule applies to your flight."],[CheckCircle2,"Transparent Process","No hidden fees. No surprises."],[Plane,"US & Global Coverage","Built for US flights, with support for international trips too."]].map(([Icon,title,body])=>{const I=Icon as typeof Plane;return <div key={String(title)} className="flex gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-blue-soft text-brand-blue"><I className="size-5"/></span><div><h3 className="text-sm font-bold text-navy">{String(title)}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{String(body)}</p></div></div>})}</div></div></div></section>

    <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><h2 className="text-center text-2xl font-extrabold text-navy">Your US passenger rights at a glance</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{rights.map(r=><article key={r.title} className="rounded-lg border border-border bg-card p-5 shadow-sm"><h3 className="text-sm font-bold text-navy">{r.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p></article>)}</div><p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">Rules and dollar limits are set by the US Department of Transportation and can change. We confirm eligibility on every claim.</p></div></section>
  </PageShell>;
}
