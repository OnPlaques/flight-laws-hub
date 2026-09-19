import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import markAsset from "@/assets/jetclaim-mark.png.asset.json";

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
      <img
        src={markAsset.url}
        alt="JetClaim logo"
        width={40}
        height={40}
        className="size-10 shrink-0 object-contain"
      />
      <span className="leading-none">
        <span
          className={cn(
            "block text-xl font-extrabold tracking-tight",
            invert ? "text-navy-foreground" : "text-navy",
          )}
        >
          JetClaim
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
