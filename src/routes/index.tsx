import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isAuthed } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: isAuthed() ? "/dashboard" : "/login", replace: true });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
      Loading…
    </div>
  );
}
