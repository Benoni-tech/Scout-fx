"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert, XCircle } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminGate";

type Ticket = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  attended: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
  cancelled?: boolean;
  cancelledBy?: string | null;
};

function time(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "";
}

export default function CheckinView({ code }: { code: string }) {
  const { authFetch } = useAdmin();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [state, setState] = useState<"loading" | "notFound" | "ready" | "admitting" | "admitted" | "error">("loading");
  const [error, setError] = useState("");

  const lookup = useCallback(async () => {
    const res = await authFetch(`/api/admin/checkin?code=${encodeURIComponent(code)}`);
    const data = await res.json().catch(() => ({}));
    if (res.status === 404) return setState("notFound");
    if (!res.ok) {
      setError(data?.error || "Lookup failed.");
      return setState("error");
    }
    setTicket(data.rsvp);
    setEventTitle(data.eventTitle);
    setState("ready");
  }, [authFetch, code]);

  useEffect(() => {
    lookup();
  }, [lookup]);

  async function admit() {
    setState("admitting");
    const res = await authFetch("/api/admin/checkin", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    if (res.ok) return setState("admitted");
    if (res.status === 409 || res.status === 410) return lookup(); // admitted or cancelled meanwhile
    const data = await res.json().catch(() => ({}));
    setError(data?.error || "Check-in failed.");
    setState("error");
  }

  if (state === "loading") {
    return <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-400" />;
  }

  if (state === "notFound") {
    return (
      <Panel tone="bad" icon={<XCircle className="h-10 w-10" />} title="Ticket not found">
        <p>Code <span className="font-mono font-bold">{code}</span> doesn&apos;t match any registration. Don&apos;t admit.</p>
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel tone="bad" icon={<XCircle className="h-10 w-10" />} title="Something went wrong">
        <p>{error}</p>
      </Panel>
    );
  }

  const t = ticket!;

  if (state === "admitted") {
    return (
      <Panel tone="good" icon={<CheckCircle2 className="h-10 w-10" />} title="Admitted">
        <p className="text-2xl font-extrabold">{t.name}</p>
        <p className="mt-1">{eventTitle}</p>
      </Panel>
    );
  }

  if (t.cancelled) {
    return (
      <Panel tone="bad" icon={<XCircle className="h-10 w-10" />} title="Cancelled ticket">
        <p className="text-2xl font-extrabold">{t.name}</p>
        <p className="mt-1">This registration was cancelled{t.cancelledBy ? ` by ${t.cancelledBy}` : ""}. Don&apos;t admit.</p>
      </Panel>
    );
  }

  if (t.attended) {
    return (
      <Panel tone="warn" icon={<TriangleAlert className="h-10 w-10" />} title="Already checked in">
        <p className="text-2xl font-extrabold">{t.name}</p>
        <p className="mt-1">
          Used at {time(t.checkedInAt)}{t.checkedInBy ? ` by ${t.checkedInBy}` : ""}. Don&apos;t admit again.
        </p>
      </Panel>
    );
  }

  return (
    <div className="card rounded-3xl p-6 text-center shadow-card">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Valid ticket</p>
      <p className="mt-2 text-3xl font-extrabold text-white">{t.name}</p>
      <p className="mt-1 text-sm text-zinc-400">{t.email} · {t.whatsapp}</p>
      <p className="mt-1 text-sm text-zinc-400">{eventTitle}</p>
      <p className="mt-3 font-mono text-sm text-zinc-300">{t.id}</p>
      <button
        onClick={admit}
        disabled={state === "admitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-4 text-lg font-extrabold text-black disabled:opacity-60"
      >
        {state === "admitting" && <Loader2 className="h-5 w-5 animate-spin" />}
        Admit
      </button>
    </div>
  );
}

function Panel({
  tone,
  icon,
  title,
  children,
}: {
  tone: "good" | "warn" | "bad";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    good: "bg-brand-600 text-black",
    warn: "bg-white text-black",
    bad: "bg-danger text-white",
  }[tone];
  return (
    <div className={`rounded-3xl p-8 text-center ${styles}`}>
      <div className="flex justify-center">{icon}</div>
      <p className="mt-3 text-sm font-bold uppercase tracking-wider">{title}</p>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}
