"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Lock, LockOpen } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminGate";

type State = { open: boolean; updatedAt?: string; updatedBy?: string };

/** Fired after a change so the sidebar's Archive list updates without a reload. */
export const REGISTRATION_CHANGED = "registration-changed";

export function useRegistrationStates() {
  const { authFetch } = useAdmin();
  const [states, setStates] = useState<Record<string, State> | null>(null);
  const load = useCallback(async () => {
    const res = await authFetch("/api/admin/registration");
    if (res.ok) setStates((await res.json()).states);
  }, [authFetch]);
  useEffect(() => {
    load();
    window.addEventListener(REGISTRATION_CHANGED, load);
    return () => window.removeEventListener(REGISTRATION_CHANGED, load);
  }, [load]);
  return states;
}

/** Open/close registration for the Seed Program ("seed") or an event ("event:<id>"). */
export default function RegistrationSwitch({ regKey, name }: { regKey: string; name: string }) {
  const { authFetch } = useAdmin();
  const states = useRegistrationStates();
  const [busy, setBusy] = useState(false);
  const state = states?.[regKey];

  async function toggle() {
    if (!state) return;
    const next = !state.open;
    const msg = next
      ? `Reopen registration for ${name}? It will show on the website again and people can sign up.`
      : `Close registration for ${name}? It will be hidden from the website menus and listings, and new sign-ups will be refused. Everything here stays manageable, under Archive.`;
    if (!confirm(msg)) return;
    setBusy(true);
    const res = await authFetch("/api/admin/registration", {
      method: "POST",
      body: JSON.stringify({ key: regKey, open: next }),
    });
    setBusy(false);
    if (!res.ok) return alert((await res.json().catch(() => ({})))?.error || "Couldn't update registration.");
    window.dispatchEvent(new Event(REGISTRATION_CHANGED));
  }

  if (!state) return <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          state.open ? "bg-brand-500/10 text-brand-500" : "bg-white/10 text-zinc-300"
        }`}
      >
        {state.open ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
        Registration {state.open ? "open" : "closed"}
      </span>
      <button
        onClick={toggle}
        disabled={busy}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-50 ${
          state.open
            ? "border border-danger/40 text-danger hover:bg-danger/10"
            : "bg-brand-600 text-black hover:bg-brand-700"
        }`}
      >
        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {state.open ? "Close registration" : "Reopen registration"}
      </button>
      {state.updatedBy && (
        <span className="text-xs text-zinc-500">
          Last changed by {state.updatedBy}
          {state.updatedAt ? ` · ${new Date(state.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}
        </span>
      )}
    </div>
  );
}
