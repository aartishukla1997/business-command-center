import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { isAuthed } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !isAuthed()) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
