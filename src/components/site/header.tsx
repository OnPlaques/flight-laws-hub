import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/your-rights", label: "Your rights" },
  { to: "/regulations", label: "Regulations" },
  { to: "/about", label: "About" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Logo />
      <nav className="hidden items-center gap-6 xl:flex">{NAV.map(item => <Link key={item.to} to={item.to} className="text-sm font-semibold text-foreground/70 transition-colors hover:text-brand-blue" activeProps={{ className: "text-brand-blue" }}>{item.label}</Link>)}</nav>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="gap-1.5 bg-navy text-navy-foreground hover:bg-navy-deep"><Link to="/claim">Check my flight <ArrowRight className="size-4" /></Link></Button>
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</Button>
      </div>
    </div>
    {open ? <nav className="border-t border-border bg-background px-4 py-3 xl:hidden">{NAV.map(item => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-semibold text-foreground/75">{item.label}</Link>)}</nav> : null}
  </header>;
}
