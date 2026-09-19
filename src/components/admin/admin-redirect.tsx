import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-admin";

/**
 * Keeps admin sessions out of the client-facing dashboard/claim views.
 * Returns a loading node to render instead of the page, or null when the
 * current user is a normal client.
 */
export function useAdminRedirect() {
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) navigate({ to: "/admin", replace: true });
  }, [isAdmin, loading, navigate]);

  if (loading || isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return null;
}