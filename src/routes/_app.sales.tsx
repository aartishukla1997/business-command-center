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
import { sales as initialSales, type Sale } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/sales")({
  head: () => ({ meta: [{ title: "Sales — Nimbus Admin" }] }),
  component: SalesPage,
});

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
type SortKey = "invoice" | "customer" | "amount" | "date";

function SalesPage() {
  const [data, setData] = useState<Sale[]>(initialSales);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = data.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (!q.trim()) return true;
      const t = q.toLowerCase();
      return (
        s.invoice.toLowerCase().includes(t) ||
        s.customer.toLowerCase().includes(t) ||
        s.product.toLowerCase().includes(t)
      );
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [data, q, status, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const remove = (id: string) => {
    setData((d) => d.filter((s) => s.id !== id));
    toast.success("Sale deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sales</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} invoices found</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button><Plus className="mr-2 h-4 w-4" /> New sale</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search invoice, customer, product…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><button onClick={() => toggleSort("invoice")} className="flex items-center gap-1 hover:text-foreground">Invoice <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead><button onClick={() => toggleSort("customer")} className="flex items-center gap-1 hover:text-foreground">Customer <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right"><button onClick={() => toggleSort("amount")} className="ml-auto flex items-center gap-1 hover:text-foreground">Amount <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead>Status</TableHead>
                <TableHead><button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground">Date <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-12 text-center text-muted-foreground">No sales match your filters.</TableCell></TableRow>
              ) : paged.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.invoice}</TableCell>
                  <TableCell>{s.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{s.product}</TableCell>
                  <TableCell className="text-right">{s.quantity}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(s.amount)}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{s.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast(`Viewing ${s.invoice}`)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast(`Editing ${s.invoice}`)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => remove(s.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
