import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/site/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Flightclaim" },
      { name: "description", content: "How Flightclaim handles information submitted with flight compensation claims." },
      { property: "og:title", content: "Privacy Policy — Flightclaim" },
      { property: "og:description", content: "How Flightclaim handles passenger and claim information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell>
      <PageHero title="Privacy Policy" subtitle="Your information is used only to assess and manage your claim." />
      <section className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-7 text-muted-foreground sm:px-6">
        <div><h2 className="text-lg font-bold text-navy">Information we collect</h2><p className="mt-2">We collect the contact, flight and supporting document information you provide when checking, submitting or tracking a claim.</p></div>
        <div><h2 className="text-lg font-bold text-navy">How it is used</h2><p className="mt-2">We use your information to review eligibility, communicate about your case, prepare claim documents and pursue the airline on your behalf.</p></div>
        <div><h2 className="text-lg font-bold text-navy">Storage and access</h2><p className="mt-2">Claim records and documents are stored securely. Access is limited to the people and services needed to manage your case and meet legal obligations.</p></div>
        <div><h2 className="text-lg font-bold text-navy">Your choices</h2><p className="mt-2">You may ask for access to, correction of or deletion of your personal information, subject to any legal record-keeping requirements.</p></div>
      </section>
    </PageShell>
  );
}