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
import { upcomingEvents } from "@/lib/events";
import { useRegistrationStates } from "@/components/admin/RegistrationSwitch";
import {
  CalendarDays,
  Home,
  Loader2,
  LockKeyhole,
  LogOut,
  ScanLine,
  Sprout,
  Users,
  Archive,
  Newspaper,
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
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
          // File uploads (FormData) set their own multipart Content-Type.
          ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
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

type NavItem = { href: string; label: string; icon: typeof Home };

const NAV: NavItem[] = [
  { href: "/admin", label: "Home", icon: Home },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/seed", label: "Seed registrations", icon: Sprout },
  { href: "/admin/community", label: "Community", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/checkin", label: "Check-in", icon: ScanLine },
];

function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href.split("?")[0]);

  // Programs and events with closed registration move from the main menu to Archive,
  // where they stay fully manageable (statuses, seed awards, check-ins, exports).
  const states = useRegistrationStates();
  const seedClosed = states?.seed?.open === false;
  const closedEvents = upcomingEvents.filter((e) => states?.[`event:${e.id}`]?.open === false);
  const nav = NAV.filter((n) => !(seedClosed && n.href === "/admin/seed"));
  const archive: NavItem[] = [
    ...(seedClosed ? [{ href: "/admin/seed", label: "Seed Program", icon: Sprout }] : []),
    ...closedEvents.map((e) => ({ href: `/admin/events?event=${e.id}`, label: e.title, icon: CalendarDays })),
  ];
  // Collapsed = icons only. Remembered on this device (storage can be blocked; that's fine).
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("admin-sidebar") === "collapsed");
    } catch {}
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);
  function toggle() {
    setCollapsed((c) => {
      try {
        localStorage.setItem("admin-sidebar", c ? "open" : "collapsed");
      } catch {}
      return !c;
    });
  }

  const navLink = (item: NavItem, small: boolean) => (
    <Link
      key={item.href}
      href={item.href}
      title={small ? item.label : undefined}
      className={`flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors ${small ? "justify-center px-0" : "px-3"} ${
        active(item.href) ? "bg-brand-500/10 text-brand-500" : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!small && <span className="truncate">{item.label}</span>}
    </Link>
  );

  const sidebar = (small: boolean) => (
    <div className="flex h-full flex-col p-3">
      <div className={`mb-6 flex items-center ${small ? "flex-col gap-3" : "justify-between gap-2 px-2"} pt-2`}>
        <Link href="/admin" className="flex items-center gap-2" title="Admin home">
          <Image src="/logo.png" alt="" width={16} height={18} className="h-4 w-auto" />
          {!small && (
            <>
              <span className="text-sm font-extrabold uppercase tracking-tight text-white">Scout FX</span>
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-500">
                Admin
              </span>
            </>
          )}
        </Link>
        <button
          onClick={toggle}
          title={small ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={small ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white md:block"
        >
          {small ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="space-y-1">{nav.map((n) => navLink(n, small))}</nav>

      {archive.length > 0 && (
        <div className="mt-6">
          {small ? (
            <div className="mx-auto mb-2 h-px w-6 bg-white/10" title="Archive" />
          ) : (
            <p className="flex items-center gap-2 px-3 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              <Archive className="h-3.5 w-3.5" /> Archive
            </p>
          )}
          <nav className="mt-2 space-y-1">{archive.map((n) => navLink(n, small))}</nav>
        </div>
      )}

      <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
        {!small && (
          <p className="truncate px-3 pb-1 text-xs text-zinc-500" title={email}>
            {email}
          </p>
        )}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          title="View website"
          className={`flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white ${small ? "justify-center" : "px-3"}`}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!small && "View website"}
        </a>
        <button
          onClick={() => signOut(auth)}
          title="Sign out"
          className={`flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white ${small ? "justify-center" : "px-3"}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!small && "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* desktop sidebar (the public navbar and footer are hidden on admin pages) */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-zinc-950/80 transition-[width] duration-200 md:block ${
          collapsed ? "w-[68px]" : "w-60"
        }`}
      >
        {sidebar(collapsed)}
      </aside>

      {/* phones: a menu button opens the same sidebar as a drawer */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-black shadow-glow md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-zinc-950">
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
            {sidebar(false)}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1">{children}</main>
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
