import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo invert />
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
            Flightclaim helps air passengers file complaints and recover the refunds and compensation
            they are entitled to under US DOT rules and international aviation regulations.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/how-it-works" className="text-navy-foreground/80 hover:text-navy-foreground">How It Works</Link></li>
            <li><Link to="/your-rights" className="text-navy-foreground/80 hover:text-navy-foreground">Your Rights</Link></li>
            <li><Link to="/regulations" className="text-navy-foreground/80 hover:text-navy-foreground">Regulations</Link></li>
            <li><Link to="/faqs" className="text-navy-foreground/80 hover:text-navy-foreground">FAQs</Link></li>
            <li><Link to="/contact" className="text-navy-foreground/80 hover:text-navy-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="text-navy-foreground/80 hover:text-navy-foreground">About Us</Link></li>
            <li><Link to="/privacy" className="text-navy-foreground/80 hover:text-navy-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-navy-foreground/80 hover:text-navy-foreground">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-navy-foreground/60 sm:px-6">
          © {new Date().getFullYear()} Flightclaim. All rights reserved. Flightclaim is not a law firm and
          does not provide legal advice. Flightclaim is an independent service and is not affiliated with any airline.
        </p>
      </div>
    </footer>
  );
}
