import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { PageHero, PageShell } from "@/components/site/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Flightclaim — Talk to Our Claims Team" },
      { name: "description", content: "Get in touch with the Flightclaim team about a flight complaint, an existing claim or a payout question." },
      { property: "og:title", content: "Contact Flightclaim" },
      { property: "og:description", content: "Our claims team replies within 40 minutes, open Monday to Sunday." },
      { property: "og:url", content: "https://jetclaim-assist.lovable.app/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jetclaim-assist.lovable.app/contact" }],
  }),
  component: Contact,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]!.message); return; }
    toast.success("Thanks — our team will reply within 40 minutes, Monday to Sunday.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <PageShell>
      <PageHero title="Contact" subtitle="Questions about a claim, a payout or your rights? We're here." />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="space-y-1.5">
            <Label htmlFor="cname">Name</Label>
            <Input id="cname" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cemail">Email</Label>
            <Input id="cemail" type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cmsg">Message</Label>
            <Textarea id="cmsg" rows={6} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button type="submit" className="bg-navy text-navy-foreground hover:bg-navy-deep">Send message</Button>
        </form>
      </section>
    </PageShell>
  );
}
