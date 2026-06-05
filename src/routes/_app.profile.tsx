import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { getUser, setUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — Nimbus Admin" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const current = getUser();
  const [form, setForm] = useState(current);
  const [password, setPassword] = useState("");

  const initials = form.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(form);
    toast.success("Profile updated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account details and password.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-md hover:opacity-90">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 font-semibold">{form.name}</div>
            <div className="text-sm text-muted-foreground">{form.email}</div>
            <Badge variant="outline" className="mt-2 border-primary/30 bg-primary/10 text-primary">{form.role}</Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
            <CardDescription>Update your profile and password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input id="password" type="password" placeholder="Leave blank to keep current password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setForm(current); setPassword(""); }}>Cancel</Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
