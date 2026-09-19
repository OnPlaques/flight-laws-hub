import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FileText,
  Globe,
  Headset,
  Lock,
  Mail,
  Search,
  Shield,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";
import heroImage from "@/assets/hero-plane.jpg";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISSUE_TYPES, REGULATION_BADGES } from "@/lib/jetclaim";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JetClaim — Flight Delay & Cancellation Compensation" },
      {
        name: "description",
        content:
          "JetClaim helps passengers claim compensation and refunds for delayed, cancelled and disrupted flights under EU261, UK261, US DOT and more.",
      },
      { property: "og:title", content: "JetClaim — We Fight. You Fly." },
      {
        property: "og:description",
        content:
          "File a flight complaint and claim compensation or a refund under international aviation regulations.",
      },
      { property: "og:url", content: "https://jetclaim-assist.lovable.app" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jetclaim-assist.lovable.app" }],
  }),
  component: Landing,
});

const STEPS = [
  {
    icon: FileText,
    title: "File Your Claim",
    body: "Tell us about your flight issue and upload your documents.",
  },
  {
    icon: Search,
    title: "We Check Your Case",
    body: "Our experts verify your claim and check your eligibility under the applicable regulations.",
  },
  {
    icon: Mail,
    title: "We Handle Everything",
    body: "We contact the airline and handle all communication on your behalf — you sit back and relax.",
  },
  {
    icon: Wallet,
    title: "Get Your Compensation",
    body: "Once your claim is successful, you get paid.",
  },
];

const TRUST = [
  { icon: Shield, title: "Transparent Fees", body: "Fee is agreed upfront before your claim proceeds." },
  { icon: Globe, title: "Global Coverage", body: "We handle claims worldwide." },
  { icon: Lock, title: "Secure & Confidential", body: "Your data is 100% protected." },
  { icon: Headset, title: "Expert Support", body: "Our team is here to help at every step." },
  { icon: Trophy, title: "98% Success Rate", body: "Thousands of passengers compensated." },
];

function Landing() {
  const navigate = useNavigate();
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [issueType, setIssueType] = useState("");

  function checkClaim(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: "/claim",
      search: {
        flight: flightNumber || undefined,
        date: flightDate || undefined,
        issue: issueType || undefined,
      },
    });
  }

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Passenger aircraft taking off at golden hour"
          width={1920}
          height={1088}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="text-navy">
            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              Flight Problems?
              <br />
              We Fight for Your
              <br />
              <span className="text-brand-blue">Refunds &amp; Compensation.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-navy/75">
              JetClaim helps you file complaints and get what you're entitled to under
              international aviation regulations.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {["Transparent Fees", "98% Success Rate", "Trusted by Thousands of Passengers"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex size-5 items-center justify-center rounded-full bg-navy text-navy-foreground">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>

            <div className="mt-10 inline-flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/90 px-4 py-3 text-sm shadow-sm backdrop-blur">
              <span className="font-bold text-navy">Excellent</span>
              <span className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <span className="text-muted-foreground">4.8 out of 5 based on 2,500+ reviews</span>
              <span className="font-semibold text-navy">★ Trustpilot</span>
            </div>
          </div>

          {/* Hero widget */}
          <div className="lg:pl-6">
            <form
              onSubmit={checkClaim}
              className="rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            >
              <h2 className="text-center text-2xl font-bold text-navy">Check Your Flight</h2>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Start your claim in less than 3 minutes
              </p>

              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="flight">Flight Number</Label>
                  <Input
                    id="flight"
                    placeholder="e.g. BA123"
                    maxLength={10}
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date of Flight</Label>
                  <Input
                    id="date"
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="issue">Issue Type</Label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger id="issue">
                      <SelectValue placeholder="Select issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISSUE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full gap-2 bg-navy py-6 text-base text-navy-foreground hover:bg-navy-deep"
              >
                Check My Claim <ArrowRight className="size-4" />
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5" /> Your data is secure and confidential
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">How It Works</h2>
          <p className="mt-3 text-muted-foreground">Compensation in 4 simple steps</p>

          <div className="mt-12 grid gap-10 md:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center">
                <div className="flex w-full items-center justify-center">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-blue-soft text-brand-blue">
                    <step.icon className="size-7" />
                  </span>
                  {i < STEPS.length - 1 ? (
                    <span className="ml-4 hidden flex-1 items-center gap-3 md:flex">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-blue-soft text-xs font-bold text-brand-blue">
                        {i + 1}
                      </span>
                      <span className="h-px flex-1 border-t border-dashed border-brand-blue/40" />
                    </span>
                  ) : (
                    <span className="ml-4 hidden size-7 shrink-0 items-center justify-center rounded-full bg-brand-blue-soft text-xs font-bold text-brand-blue md:flex">
                      {i + 1}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulations */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy">We Cover International Regulations</h2>

            <div className="mt-6 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {REGULATION_BADGES.slice(0, 6).map((reg) => (
                <div key={reg.code} className="flex items-start gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-blue-soft text-[10px] font-extrabold text-brand-blue">
                    {reg.code.slice(0, 4)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy">{reg.label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{reg.detail}</p>
                  </div>
                </div>
              ))}
              <div className="flex xl:justify-end">
                <Button asChild variant="outline" className="gap-2 border-navy text-navy">
                  <Link to="/regulations">
                    View All Regulations <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-navy py-14 text-navy-foreground" aria-labelledby="why-jetclaim">
        <h2 id="why-jetclaim" className="sr-only">
          Why passengers choose JetClaim
        </h2>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
          {TRUST.map((item) => (
            <div key={item.title}>
              <item.icon className="size-7 text-brand-blue" />
              <h3 className="mt-3 font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-navy-foreground/70">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
