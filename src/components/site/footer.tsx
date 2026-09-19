import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { Logo } from "./logo";

const socialLinks = [
  { Icon: Twitter, href: "https://x.com/ameliakatep?s=11", label: "Twitter" },
  { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/jetclaim.online?stkn=MXNteWE0MnA3eHhwbw%3D%3D&utm_source=qr",
    label: "Instagram",
  },
  { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:jetclaimsupport@gmail.com", label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo invert />
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
            Flightclaim helps air passengers worldwide file complaints and recover the compensation
            and refunds they are entitled to under international aviation regulations.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full bg-navy-foreground/10 text-navy-foreground/80 transition-colors hover:bg-navy-foreground/20 hover:text-navy-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
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
            <li><span className="text-navy-foreground/80">Privacy Policy</span></li>
            <li><span className="text-navy-foreground/80">Terms of Service</span></li>
            <li><Link to="/admin-login" className="text-navy-foreground/80 hover:text-navy-foreground">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-navy-foreground/60 sm:px-6">
          © {new Date().getFullYear()} Flightclaim. All rights reserved. Flightclaim is not a law firm and
          does not provide legal advice.
        </p>
      </div>
    </footer>
  );
}
