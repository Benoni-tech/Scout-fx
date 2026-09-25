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
import { Loader2, LockKeyhole, LogOut } from "lucide-react";
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
      <div className="border-b border-white/10 bg-zinc-950">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
          <nav className="flex flex-wrap gap-1">
            {[
              ["/admin", "Overview"],
              ["/admin/events", "Registrations"],
              ["/admin/checkin", "Check-in"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 font-semibold text-zinc-300 hover:bg-white/5"
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.email}</span>
            <span className="sm:hidden">Sign out</span>
          </button>
        </Container>
      </div>
      {children}
    </AdminContext.Provider>
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
        <LockKeyhole className="h-5 w-5 text-white" />
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
