import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  invert = false,
  showTagline = true,
}: {
  className?: string;
  invert?: boolean;
  showTagline?: boolean;
}) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-md bg-brand-blue", invert ? "text-navy" : "text-primary-foreground")}>
        <Plane className="size-5 -rotate-12" aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-xl font-extrabold",
            invert ? "text-navy-foreground" : "text-navy",
          )}
        >
          Flightclaim
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-0.5 block text-[11px] font-medium",
              invert ? "text-navy-foreground/70" : "text-muted-foreground",
            )}
          >
            We Fight. You Fly.
          </span>
        ) : null}
      </span>
    </Link>
  );
}
