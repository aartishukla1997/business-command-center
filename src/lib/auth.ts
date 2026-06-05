// Tiny mock auth — UI demo only, no real security.
const KEY = "demo-auth";

export interface DemoUser {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

const defaultUser: DemoUser = {
  name: "Alex Morgan",
  email: "alex.morgan@company.com",
  phone: "+1 (555) 010-2233",
  role: "Administrator",
};

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function login() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, "1");
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function getUser(): DemoUser {
  if (typeof window === "undefined") return defaultUser;
  const raw = localStorage.getItem("demo-user");
  return raw ? { ...defaultUser, ...JSON.parse(raw) } : defaultUser;
}

export function setUser(u: Partial<DemoUser>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("demo-user", JSON.stringify({ ...getUser(), ...u }));
}
