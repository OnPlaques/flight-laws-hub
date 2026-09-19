import { Link } from "@tanstack/react-router";
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
    <Link to="/" aria-label="Flightclaim home" className={cn("flex items-center gap-2.5", className)}>
      <img src="/favicon.svg" alt="" className="size-10 shrink-0" aria-hidden="true" />
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
