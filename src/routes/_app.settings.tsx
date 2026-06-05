import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Nimbus Admin" }] }),
  component: SettingsPage,
});

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Preferences for your workspace.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Configure how the dashboard behaves.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <Row title="Email notifications" desc="Receive updates about sales and purchase activity.">
            <Switch defaultChecked />
          </Row>
          <Row title="Weekly digest" desc="Summary of business performance every Monday.">
            <Switch defaultChecked />
          </Row>
          <Row title="Currency" desc="Currency used across reports and tables.">
            <Select defaultValue="usd">
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row title="Timezone" desc="Used for invoice and purchase timestamps.">
            <Select defaultValue="utc">
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">EST (UTC-5)</SelectItem>
                <SelectItem value="pst">PST (UTC-8)</SelectItem>
                <SelectItem value="cet">CET (UTC+1)</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Irreversible account actions.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Delete workspace</Label>
            <p className="text-sm text-muted-foreground">Permanently remove your workspace and data.</p>
          </div>
          <Button variant="destructive" onClick={() => toast.error("Demo only — workspace not deleted")}>Delete</Button>
        </CardContent>
      </Card>
    </div>
  );
}
