import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Nimbus Admin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@nimbus.app");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login();
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">N</div>
          Nimbus Admin
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight">Run your business with clarity.</h1>
          <p className="max-w-md text-primary-foreground/80">
            Track sales, purchases, and revenue across every product line — all in one elegant dashboard.
          </p>
        </div>
        <div className="text-sm text-primary-foreground/60">© {new Date().getFullYear()} Nimbus Inc.</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-none shadow-none lg:shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Use your account credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or username</Label>
                <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox defaultChecked /> Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo build · any credentials accepted
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
