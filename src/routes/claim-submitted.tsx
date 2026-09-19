import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/claim-submitted")({
  validateSearch: z.object({ ref: z.string().max(30).optional() }),
  head: () => ({
    meta: [
      { title: "Claim Submitted — Flightclaim" },
      { name: "description", content: "Your Flightclaim flight claim has been received and is now under review." },
      { property: "og:title", content: "Claim Submitted — Flightclaim" },
      { property: "og:description", content: "Your flight claim reference and next steps." },
    ],
  }),
  component: Submitted,
});

function Submitted() {
  const { ref } = Route.useSearch();
  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto size-14 text-success" />
        <h1 className="mt-6 text-3xl font-extrabold text-navy">Claim Submitted</h1>
        <p className="mt-3 text-muted-foreground">
          Your claim has been submitted. Our team is reviewing your case and will contact you soon.
        </p>
        {ref ? (
          <p className="mt-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
            Your claim reference: <span className="font-bold text-navy">{ref}</span>
          </p>
        ) : null}
        <p className="mt-4 text-sm text-muted-foreground">
          Keep this reference — you can follow every stage of your claim on the tracking page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-navy text-navy-foreground hover:bg-navy-deep">
            <Link to="/track">Track my claim</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Return home</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
