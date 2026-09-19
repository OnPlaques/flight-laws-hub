import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Mail, Search, Wallet } from "lucide-react";
import { PageHero, PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/use-admin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How JetClaim Works — 4 Steps to Compensation" },
      { name: "description", content: "See how JetClaim takes your flight claim from submission to payout in four simple steps." },
      { property: "og:title", content: "How JetClaim Works" },
      { property: "og:description", content: "From claim to payout in four simple steps." },
      { property: "og:url", content: "https://jetclaim-assist.lovable.app/how-it-works" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jetclaim-assist.lovable.app/how-it-works" }],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    icon: FileText,
    title: "File Your Claim",
    body: "Tell us about your flight issue and upload your documents. It takes under three minutes and you only need your flight number, date and a description of what happened.",
  },
  {
    icon: Search,
    title: "We Check Your Case",
    body: "Our experts verify your claim and check your eligibility under the applicable regulations — EU261, UK261, US DOT, APPR, DGCA, ANAC, the Montreal Convention and more.",
  },
  {
    icon: Mail,
    title: "We Handle Everything",
    body: "We contact the airline and handle all communication on your behalf, including escalation to the national enforcement body where necessary.",
  },
  {
    icon: Wallet,
    title: "Get Your Compensation",
    body: "Once your claim is successful you settle the agreed fee, add your bank details, and we transfer the compensation to you.",
  },
];

const FAQS = [
  { q: "How long does a claim take?", a: "Most claims are resolved in 4 to 12 weeks. Complex or escalated cases can take longer, and we keep you updated at every stage." },
  { q: "What documents do I need?", a: "Your booking confirmation and boarding pass are ideal. Baggage tags and receipts help for baggage or expense claims." },
  { q: "How much does JetClaim charge?", a: "Our fee is agreed with you upfront before your claim proceeds — no hidden costs and no surprises." },
  { q: "What if my claim is unsuccessful?", a: "If your claim does not succeed, you owe nothing." },
];

function HowItWorks() {
  const { isAdmin } = useIsAdmin();
  return (
    <PageShell>
      <PageHero title="How It Works" subtitle="Compensation in 4 simple steps — we handle the airline, you handle the packing." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-10">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-5">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-blue-soft text-brand-blue">
                <step.icon className="size-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">Step {i + 1}</p>
                <h2 className="mt-1 text-xl font-bold text-navy">{step.title}</h2>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold text-navy">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-4">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {isAdmin ? null : (
          <Button asChild className="mt-10 bg-navy text-navy-foreground hover:bg-navy-deep">
            <Link to="/claim">Start your claim</Link>
          </Button>
        )}
      </section>
    </PageShell>
  );
}
