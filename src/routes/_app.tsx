import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { isAuthed } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthed()) navigate({ to: "/login", replace: true });
  }, [navigate]);
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
