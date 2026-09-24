"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function RsvpForm({ eventId }: { eventId: string }) {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{
    ticketCode?: string;
    alreadyRegistered?: boolean;
    emailSent?: boolean;
  }>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId, source: "event-page" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setResult(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-brand-600 bg-brand-600 p-5 text-ink-900">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">
            {result.alreadyRegistered
              ? "You're already registered."
              : "You're registered."}
          </p>
          <p className="text-sm">
            {result.alreadyRegistered
              ? `We've re-sent your ticket to ${form.email}.`
              : result.emailSent === false
                ? "We couldn't email your ticket, so save it from the link below."
                : `Your ticket with a QR code is on its way to ${form.email}. Show it at the gate.`}
          </p>
          {result.ticketCode && (
            <a
              href={`/ticket/${result.ticketCode}`}
              className="mt-3 inline-flex rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
            >
              View my ticket
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500"
      />
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500"
      />
      <input
        type="tel"
        required
        placeholder="WhatsApp number"
        value={form.whatsapp}
        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-gold-700 disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Reserve my spot
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-danger">{errorMsg}</p>
      )}
    </form>
  );
}
