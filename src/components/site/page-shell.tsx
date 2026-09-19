import type { ReactNode } from "react";
import { SiteHeader } from "./header";
import { SiteFooter } from "./footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="border-b border-border bg-navy py-16 text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-lg text-navy-foreground/75">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
