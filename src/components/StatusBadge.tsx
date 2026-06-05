import { Badge } from "@/components/ui/badge";

const map: Record<string, string> = {
  Paid: "bg-success/15 text-success border-success/30",
  Received: "bg-success/15 text-success border-success/30",
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  Ordered: "bg-info/15 text-info border-info/30",
  Overdue: "bg-destructive/15 text-destructive border-destructive/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  Refunded: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = map[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={`${cls} font-medium`}>
      {status}
    </Badge>
  );
}
