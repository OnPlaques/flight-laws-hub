import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/site/page-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "JetClaim FAQs — Flight Compensation Questions" },
      { name: "description", content: "Answers to the most common questions about flight compensation claims, fees, timelines and payouts." },
      { property: "og:title", content: "JetClaim FAQs" },
      { property: "og:description", content: "Fees, timelines, eligibility and payouts explained." },
      { property: "og:url", content: "https://jetclaim-assist.lovable.app/faqs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jetclaim-assist.lovable.app/faqs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }),
      },
    ],
  }),
  component: Faqs,
});

const FAQS = [
  { q: "Am I eligible for compensation?", a: "It depends on the route, the airline and the reason for the disruption. Submit your flight details and we'll check eligibility across every regulation that could apply to your itinerary — free of charge." },
  { q: "How much does JetClaim cost?", a: "Our fee is agreed with you upfront before your claim proceeds. If the claim is unsuccessful, you pay nothing." },
  { q: "How long do claims take?", a: "Most claims settle in 4 to 12 weeks. Escalated or litigated cases take longer; we keep you updated at every step." },
  { q: "How far back can I claim?", a: "Time limits vary by country — from one year in some jurisdictions to six years in the UK. Submit your claim and we'll tell you where you stand." },
  { q: "What if the delay was caused by weather?", a: "Extraordinary circumstances such as severe weather or air traffic control strikes can remove the right to compensation, but you may still be owed care, refunds or rerouting." },
  { q: "When do I get paid?", a: "Once the airline pays out and your bank details are on file, payout typically takes 1–3 weeks, and up to 6 weeks in some cases." },
  { q: "Can I claim for lost or damaged baggage?", a: "Yes. Under the Montreal Convention you can claim for lost, damaged or delayed baggage on international itineraries. Keep your baggage tags and receipts." },
  { q: "Is my data safe?", a: "Yes. Your documents are stored encrypted, only you and our claims team can access them, and we never sell your data." },
];

function Faqs() {
  return (
    <PageShell>
      <PageHero title="FAQs" subtitle="Everything passengers ask us before filing a claim." />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Accordion type="single" collapsible>
          {FAQS.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageShell>
  );
}
