"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  FormEvent,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  Loader2,
  LockKeyhole,
  LogOut,
  ScanLine,
  Sprout,
  Users,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { Container } from "@/components/ui";

type AdminCtx = {
  email: string;
  authFetch: (input: string, init?: RequestInit) => Promise<Response>;
};

const AdminContext = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminGate>");
  return ctx;
}

export default function AdminGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [phase, setPhase] = useState<"loading" | "signedOut" | "denied" | "ok">(
    "loading"
  );
  const [deniedMsg, setDeniedMsg] = useState("");

  const authFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      const token = await auth.currentUser?.getIdToken();
      return fetch(input, {
        ...init,
        headers: {
          ...(init.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(init.body ? { "Content-Type": "application/json" } : {}),
        },
      });
    },
    []
  );

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setPhase("signedOut");
        return;
      }
      setPhase("loading");
      const res = await authFetch("/api/admin/me");
      if (res.ok) {
        setPhase("ok");
      } else {
        const data = await res.json().catch(() => ({}));
        setDeniedMsg(data?.error || "This account doesn't have admin access.");
        setPhase("denied");
      }
    });
  }, [authFetch]);

  if (phase === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (phase === "signedOut") return <SignIn />;

  if (phase === "denied") {
    return (
      <Container className="max-w-md py-20 text-center">
        <p className="text-sm font-semibold text-white">{deniedMsg}</p>
        <p className="mt-1 text-sm text-zinc-400">Signed in as {user?.email}</p>
        <button
          onClick={() => signOut(auth)}
          className="mt-6 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
        >
          Sign out
        </button>
      </Container>
    );
  }

  return (
    <AdminContext.Provider value={{ email: user!.email || "", authFetch }}>
      <AdminShell email={user?.email || ""}>{children}</AdminShell>
    </AdminContext.Provider>
  );
}

const NAV = [
  { href: "/admin", label: "Home", icon: Home },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/seed", label: "Seed registrations", icon: Sprout },
  { href: "/admin/community", label: "Community", icon: Users },
  { href: "/admin/checkin", label: "Check-in", icon: ScanLine },
];

function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-4">
      <div className="flex min-h-[75vh] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-card backdrop-blur">
        {/* sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-white/10 md:block">
          <div className="sticky top-24 flex h-[75vh] flex-col p-5">
            <Link href="/admin" className="mb-8 flex items-center gap-2 px-1">
              <Image src="/logo.png" alt="" width={16} height={18} className="h-4 w-auto" />
              <span className="text-sm font-extrabold uppercase tracking-tight text-white">Scout FX</span>
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-500">
                Admin
              </span>
            </Link>

            <nav className="space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active(item.href)
                      ? "bg-brand-500/10 text-brand-500"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
              <p className="truncate px-1 text-xs text-zinc-500" title={email}>
                {email}
              </p>
              <button
                onClick={() => signOut(auth)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* mobile tabs */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 px-3 py-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                  active(item.href) ? "bg-brand-500 text-black" : "text-zinc-400"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut(auth)}
              aria-label="Sign out"
              className="ml-auto shrink-0 rounded-full p-2 text-zinc-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      setError(
        code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
          ? "Wrong email or password."
          : code === "auth/too-many-requests"
            ? "Too many attempts. Wait a few minutes or reset the password."
            : code === "auth/user-disabled"
              ? "This account is disabled."
              : code === "auth/operation-not-allowed"
                ? "Email/password sign-in isn't enabled in Firebase."
                : `Sign-in failed (${code || "unknown error"}).`
      );
      setBusy(false);
    }
  }

  return (
    <Container className="max-w-sm py-20">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600">
        <LockKeyhole className="h-5 w-5 text-black" />
      </div>
      <h1 className="mt-4 text-center text-2xl font-extrabold text-white">
        Staff sign in
      </h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="email"
          required
          autoComplete="username"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-brand-400"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-brand-400"
        />
        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-black disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
        {error && <p className="text-center text-sm text-danger">{error}</p>}
      </form>
    </Container>
  );
}
