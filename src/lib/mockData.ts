export type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Refunded";
export type PurchaseStatus = "Received" | "Ordered" | "Cancelled" | "Pending";

export interface Sale {
  id: string;
  invoice: string;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  status: PaymentStatus;
  date: string;
}

export interface Purchase {
  id: string;
  supplier: string;
  product: string;
  quantity: number;
  cost: number;
  status: PurchaseStatus;
  date: string;
}

const customers = ["John Doe", "Jane Smith", "Acme Corp", "Globex", "Initech", "Umbrella Co", "Stark Industries", "Wayne Enterprises", "Hooli", "Pied Piper"];
const products = ["Laptop Pro 15", "Wireless Mouse", "Mechanical Keyboard", "4K Monitor", "USB-C Hub", "Webcam HD", "Standing Desk", "Office Chair", "Headphones", "Tablet 11\""];
const suppliers = ["ABC Supplier", "TechSource Ltd", "GlobalParts Inc", "Quantum Distributors", "NorthPeak Trading", "BlueOcean Wholesale"];
const paymentStatuses: PaymentStatus[] = ["Paid", "Pending", "Overdue", "Refunded"];
const purchaseStatuses: PurchaseStatus[] = ["Received", "Ordered", "Cancelled", "Pending"];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const sales: Sale[] = Array.from({ length: 48 }, (_, i) => {
  const r = seededRand(i + 1);
  const d = new Date(2026, 0, 1 + Math.floor(r() * 150));
  return {
    id: String(i + 1),
    invoice: `INV-${String(1001 + i).padStart(4, "0")}`,
    customer: customers[Math.floor(r() * customers.length)],
    product: products[Math.floor(r() * products.length)],
    quantity: 1 + Math.floor(r() * 8),
    amount: Math.round((100 + r() * 4000) * 100) / 100,
    status: paymentStatuses[Math.floor(r() * paymentStatuses.length)],
    date: d.toISOString().slice(0, 10),
  };
});

export const purchases: Purchase[] = Array.from({ length: 42 }, (_, i) => {
  const r = seededRand(i + 99);
  const d = new Date(2026, 0, 1 + Math.floor(r() * 150));
  return {
    id: `PUR-${String(2001 + i).padStart(4, "0")}`,
    supplier: suppliers[Math.floor(r() * suppliers.length)],
    product: products[Math.floor(r() * products.length)],
    quantity: 5 + Math.floor(r() * 50),
    cost: Math.round((200 + r() * 6000) * 100) / 100,
    status: purchaseStatuses[Math.floor(r() * purchaseStatuses.length)],
    date: d.toISOString().slice(0, 10),
  };
});

export const totals = {
  sales: sales.reduce((a, s) => a + s.amount, 0),
  purchases: purchases.reduce((a, p) => a + p.cost, 0),
  customers: new Set(sales.map((s) => s.customer)).size,
  get revenue() {
    return this.sales - this.purchases;
  },
};

export const monthly = Array.from({ length: 6 }, (_, i) => {
  const month = new Date(2026, i, 1).toLocaleString("en", { month: "short" });
  const monthSales = sales.filter((s) => new Date(s.date).getMonth() === i).reduce((a, s) => a + s.amount, 0);
  const monthPurchases = purchases.filter((p) => new Date(p.date).getMonth() === i).reduce((a, p) => a + p.cost, 0);
  return { month, sales: Math.round(monthSales), purchases: Math.round(monthPurchases), revenue: Math.round(monthSales - monthPurchases) };
});

export const topProducts = products.slice(0, 5).map((name) => {
  const total = sales.filter((s) => s.product === name).reduce((a, s) => a + s.amount, 0);
  return { name, value: Math.round(total) };
});

export const statusBreakdown = paymentStatuses.map((s) => ({
  name: s,
  value: sales.filter((x) => x.status === s).length,
}));
