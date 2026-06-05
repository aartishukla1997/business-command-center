import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, Plus, Search, Download } from "lucide-react";
import { purchases as initialPurchases, type Purchase } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/purchases")({
  head: () => ({ meta: [{ title: "Purchases — Nimbus Admin" }] }),
  component: PurchasesPage,
});

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
type SortKey = "id" | "supplier" | "cost" | "date";

function PurchasesPage() {
  const [data, setData] = useState<Purchase[]>(initialPurchases);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [supplier, setSupplier] = useState("all");
  const [minCost, setMinCost] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const suppliers = useMemo(() => Array.from(new Set(initialPurchases.map((p) => p.supplier))), []);

  const filtered = useMemo(() => {
    let list = data.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (supplier !== "all" && p.supplier !== supplier) return false;
      if (minCost && p.cost < Number(minCost)) return false;
      if (!q.trim()) return true;
      const t = q.toLowerCase();
      return (
        p.id.toLowerCase().includes(t) ||
        p.supplier.toLowerCase().includes(t) ||
        p.product.toLowerCase().includes(t)
      );
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [data, q, status, supplier, minCost, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const remove = (id: string) => {
    setData((d) => d.filter((p) => p.id !== id));
    toast.success("Purchase deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Purchases</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} purchase orders found</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button><Plus className="mr-2 h-4 w-4" /> New purchase</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search ID, supplier, product…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <Select value={supplier} onValueChange={(v) => { setSupplier(v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Supplier" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All suppliers</SelectItem>
              {suppliers.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Received">Received</SelectItem>
              <SelectItem value="Ordered">Ordered</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Input className="md:col-span-1" placeholder="Min cost ($)" type="number" value={minCost} onChange={(e) => { setMinCost(e.target.value); setPage(1); }} />
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><button onClick={() => toggleSort("id")} className="flex items-center gap-1 hover:text-foreground">Purchase ID <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead><button onClick={() => toggleSort("supplier")} className="flex items-center gap-1 hover:text-foreground">Supplier <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right"><button onClick={() => toggleSort("cost")} className="ml-auto flex items-center gap-1 hover:text-foreground">Cost <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead>Status</TableHead>
                <TableHead><button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground">Date <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-12 text-center text-muted-foreground">No purchases match your filters.</TableCell></TableRow>
              ) : paged.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.supplier}</TableCell>
                  <TableCell className="text-muted-foreground">{p.product}</TableCell>
                  <TableCell className="text-right">{p.quantity}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(p.cost)}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{p.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast(`Viewing ${p.id}`)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast(`Editing ${p.id}`)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => remove(p.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div>Page {safePage} of {totalPages}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
