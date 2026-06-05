import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthed } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      throw redirect({ to: isAuthed() ? "/dashboard" : "/login" });
    }
  },
  component: () => null,
});
