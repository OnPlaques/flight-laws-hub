import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Globe, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-admin";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/your-rights", label: "Your Rights" },
  { to: "/regulations", label: "Regulations" },
  { to: "/about", label: "About Us" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
] as const;

const LANGUAGES = ["EN", "DE", "FR", "ES", "PT"];

export function SiteHeader() {
  const [lang, setLang] = useState("EN");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-blue"
              activeProps={{ className: "text-brand-blue" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:inline-flex">
                <Globe className="size-4" />
                {lang}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((code) => (
                <DropdownMenuItem key={code} onSelect={() => setLang(code)}>
                  {code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              {isAdmin ? (
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link to="/admin">Admin</Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="hidden sm:inline-flex">
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Log In</Link>
            </Button>
          )}

          {isAdmin ? (
            <Button asChild size="sm" className="gap-1.5 bg-navy text-navy-foreground hover:bg-navy-deep">
              <Link to="/admin">
                Claims Queue <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="gap-1.5 bg-navy text-navy-foreground hover:bg-navy-deep">
              <Link to="/claim">
                File a Claim <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-foreground/80 hover:text-brand-blue"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium">
                    Admin
                  </Link>
                ) : null}
                <Link to="/dashboard" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium">
                  Dashboard
                </Link>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium">
                Log In
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
