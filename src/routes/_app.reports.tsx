import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, FileText, Filter } from "lucide-react";
import { sales, purchases, monthly } from "@/lib/mockData";
import {
  BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — Nimbus Admin" }] }),
  component: ReportsPage,
});

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ReportsPage() {
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-06-30");

  const filteredSales = useMemo(
    () => sales.filter((s) => s.date >= from && s.date <= to),
    [from, to]
  );
  const filteredPurchases = useMemo(
    () => purchases.filter((p) => p.date >= from && p.date <= to),
    [from, to]
  );

  const totalSales = filteredSales.reduce((a, s) => a + s.amount, 0);
  const totalPurchases = filteredPurchases.reduce((a, p) => a + p.cost, 0);
  const revenue = totalSales - totalPurchases;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Reports</h1>
        <p className="text-sm text-muted-foreground">Analyze sales, purchases and revenue trends.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="from" className="text-xs">From</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-[160px]" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="to" className="text-xs">To</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-[160px]" />
          </div>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Apply</Button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={() => toast.success("Exported to Excel")}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
            <Button variant="outline" onClick={() => toast.success("Exported to PDF")}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Sales total</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{fmt(totalSales)}</div><div className="text-xs text-muted-foreground">{filteredSales.length} invoices</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Purchases total</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{fmt(totalPurchases)}</div><div className="text-xs text-muted-foreground">{filteredPurchases.length} POs</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Net revenue</CardTitle></CardHeader>
          <CardContent><div className={`text-2xl font-bold ${revenue >= 0 ? "text-success" : "text-destructive"}`}>{fmt(revenue)}</div><div className="text-xs text-muted-foreground">Sales − Purchases</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales report</TabsTrigger>
          <TabsTrigger value="purchases">Purchase report</TabsTrigger>
          <TabsTrigger value="revenue">Revenue report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader><CardTitle>Sales by month</CardTitle></CardHeader>
            <CardContent className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="sales" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader><CardTitle>Purchases by month</CardTitle></CardHeader>
            <CardContent className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="purchases" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader><CardTitle>Revenue trend</CardTitle></CardHeader>
            <CardContent className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-3)" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
