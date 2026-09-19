import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2, FileText, Headphones, Lock, Plane, Search, ShieldCheck, Star, Users, WalletCards, XCircle } from "lucide-react";
import heroImage from "@/assets/flightclaim-airport-hero.jpg";
import wingImage from "@/assets/flightclaim-wing.jpg";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIRPORT_GROUPS } from "@/lib/jetclaim";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Flightclaim — Flight Delay & Cancellation Compensation" },
    { name: "description", content: "Flightclaim helps passengers recover compensation for delayed, cancelled, overbooked and disrupted flights." },
    { property: "og:title", content: "Flightclaim — Your Flight. Your Rights." },
    { property: "og:description", content: "Check your flight and start a compensation claim in minutes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

const disruptionTypes = [
  { icon: Plane, title: "Flight Delays", body: "Get compensation for delays of 3+ hours, depending on your flight distance." },
  { icon: XCircle, title: "Flight Cancellations", body: "Claim a refund or alternative flights when your flight is cancelled." },
  { icon: Users, title: "Overbooking", body: "If you were denied boarding, you may be entitled to compensation." },
  { icon: BriefcaseBusiness, title: "Missed Connections", body: "Get support when a delay causes you to miss your connecting flight." },
];
const steps = [
  { icon: Search, title: "Check Eligibility", body: "Enter your flight details to find out if you qualify." },
  { icon: FileText, title: "We Handle the Paperwork", body: "Our team collects the information needed to submit your claim." },
  { icon: ShieldCheck, title: "We Negotiate", body: "We deal with the airline on your behalf to get the best result." },
  { icon: WalletCards, title: "You Get Paid", body: "Once approved, your compensation is paid directly to you." },
];
const testimonials = [
  { name: "Sarah K.", place: "Nairobi, Kenya", quote: "I was delayed for five hours and didn't think I was eligible. Flightclaim made the process easy and I got my compensation within two weeks." },
  { name: "James O.", place: "London, UK", quote: "Excellent service. They handled everything and kept me updated. I highly recommend Flightclaim to anyone with a delayed or cancelled flight." },
  { name: "Amina M.", place: "Dubai, UAE", quote: "I got my refund after my flight was cancelled. The team was professional, helpful and responsive. Thank you Flightclaim!" },
];

function Landing() {
  const navigate = useNavigate();
  const [flight, setFlight] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState("");
  function check(e: React.FormEvent) { e.preventDefault(); navigate({ to: "/claim", search: { flight: flight || undefined, date: date || undefined, issue: undefined } }); }

  return <PageShell>
    <section className="relative isolate overflow-hidden border-b border-border">
      <img src={heroImage} alt="Traveler looking at an aircraft through an airport window" width={1536} height={864} decoding="async" fetchPriority="high" className="absolute inset-0 size-full object-cover object-[62%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/5" />
      <div className="relative mx-auto grid min-h-[590px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.82fr]">
        <div className="max-w-xl text-navy">
          <h1 className="text-4xl font-extrabold leading-[1.12] sm:text-5xl lg:text-[3.45rem]">Flight Delayed?<br />Cancelled? Overbooked?<br /><span className="text-brand-blue">You could be entitled to compensation.</span></h1>
          <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-navy/75">Flightclaim helps you get the compensation and refunds you’re entitled to — quickly, easily and hassle-free.</p>
          <ul className="mt-8 flex flex-wrap gap-6 text-xs font-bold sm:text-sm">{[[ShieldCheck,"No win, no fee"],[Plane,"Fast & simple process"],[Users,"Trusted by millions of travellers"]].map(([Icon,label]) => { const I=Icon as typeof Plane; return <li key={String(label)} className="flex items-center gap-2"><I className="size-5 text-brand-blue" />{String(label)}</li>; })}</ul>
        </div>
        <form onSubmit={check} className="ml-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl sm:p-7">
          <h2 className="text-2xl font-extrabold text-navy">Check Your Flight</h2><p className="mt-1 text-sm text-muted-foreground">See if you’re eligible for compensation in less than 2 minutes.</p>
          <div className="mt-5 space-y-3"><div className="relative"><Plane className="absolute left-3 top-3 size-4 text-brand-blue"/><Input aria-label="Flight number" className="pl-10" placeholder="Flight number (e.g. BA256)" value={flight} onChange={e=>setFlight(e.target.value)} /></div><div className="relative"><CalendarDays className="absolute left-3 top-3 size-4 text-brand-blue"/><Input aria-label="Date of flight" className="pl-10" type="date" value={date} onChange={e=>setDate(e.target.value)} /></div><Select value={departure} onValueChange={setDeparture}><SelectTrigger aria-label="Departure airport"><SelectValue placeholder="Departure airport" /></SelectTrigger><SelectContent>{AIRPORT_GROUPS.flatMap(g=>g.airports).map(a=><SelectItem key={a.iata} value={`${a.city} (${a.iata})`}>{a.city} ({a.iata})</SelectItem>)}</SelectContent></Select></div>
          <Button type="submit" className="mt-4 w-full gap-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue/90">Check Eligibility <ArrowRight className="size-4"/></Button><p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground"><Lock className="size-3"/>Your information is safe and secure.</p>
        </form>
      </div>
    </section>

    <section className="bg-surface py-16"><div className="mx-auto max-w-7xl px-4 text-center sm:px-6"><p className="font-bold text-navy">You could be entitled to up to</p><p className="mt-1 text-5xl font-extrabold text-brand-blue">€600</p><p className="mt-2 text-xs text-muted-foreground">per person, depending on the situation and your flight distance.</p><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{disruptionTypes.map((item,i)=><div key={item.title} className={i ? "border-border lg:border-l lg:pl-8" : ""}><span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-blue-soft text-brand-blue"><item.icon className="size-6"/></span><h3 className="mt-4 font-bold text-navy">{item.title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{item.body}</p></div>)}</div></div></section>

    <section className="py-18"><div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.5fr]"><div><p className="text-xs font-bold uppercase text-brand-blue">Simple process</p><h2 className="mt-2 text-3xl font-extrabold text-navy">How Flightclaim Works</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">We handle the complex process so you don’t have to. From checking eligibility to getting your compensation, we’re with you every step of the way.</p><Button asChild className="mt-6 gap-2 bg-brand-blue text-primary-foreground hover:bg-brand-blue/90"><Link to="/claim">Start Your Claim <ArrowRight className="size-4"/></Link></Button></div><div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">{steps.map((item,i)=><div key={item.title} className="relative text-center"><span className="absolute right-0 top-0 grid size-7 place-items-center rounded-full bg-brand-blue text-xs font-bold text-primary-foreground">{i+1}</span><span className="mx-auto grid size-14 place-items-center rounded-full bg-surface text-brand-blue"><item.icon className="size-6"/></span><h3 className="mt-4 text-sm font-bold text-navy">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.body}</p></div>)}</div></div></section>

    <section className="bg-surface py-16"><div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2"><div className="relative overflow-hidden rounded-lg"><img src={wingImage} alt="Aircraft wing above clouds at sunrise" width={1024} height={640} loading="lazy" className="aspect-[16/9] w-full object-cover"/><p className="absolute bottom-5 left-6 max-w-[10ch] -rotate-6 text-2xl font-bold italic text-primary-foreground drop-shadow">Your journey matters.</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Why choose Flightclaim</p><h2 className="mt-2 text-3xl font-extrabold text-navy">Your Rights. Our Priority.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">We’re a dedicated team of travel experts and legal professionals with a simple mission — to help you get what you’re owed.</p><div className="mt-7 grid gap-6 sm:grid-cols-2">{[[Headphones,"Expert Support","Real people, not bots. We’re here to help."],[Star,"High Success Rate","Thousands of travellers have already been compensated."],[CheckCircle2,"Transparent Process","No hidden fees. No surprises."],[Plane,"Global Coverage","We handle claims for flights worldwide."]].map(([Icon,title,body])=>{const I=Icon as typeof Plane;return <div key={String(title)} className="flex gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-blue-soft text-brand-blue"><I className="size-5"/></span><div><h3 className="text-sm font-bold text-navy">{String(title)}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{String(body)}</p></div></div>})}</div></div></div></section>

    <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><h2 className="text-center text-2xl font-extrabold text-navy">What Our Customers Say</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{testimonials.map(t=><article key={t.name} className="rounded-lg border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-brand-blue-soft font-bold text-brand-blue">{t.name.charAt(0)}</span><div><h3 className="text-sm font-bold text-navy">{t.name}</h3><div className="flex text-warning" aria-label="5 stars">{Array.from({length:5}).map((_,i)=><Star key={i} className="size-3.5 fill-current"/>)}</div></div></div><blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">“{t.quote}”</blockquote><p className="mt-3 text-xs font-medium text-muted-foreground">{t.place}</p></article>)}</div></div></section>
  </PageShell>;
}
