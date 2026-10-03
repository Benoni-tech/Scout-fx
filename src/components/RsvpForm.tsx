"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2, User, Mail, Phone, Ticket, ArrowRight } from "lucide-react";
import { trackPixel } from "@/lib/metaPixel";

export default function RsvpForm({ eventId, eventName }: { eventId: string; eventName?: string }) {
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
      // Ad conversion: only genuinely new registrations, keyed by ticket code.
      if (!data.alreadyRegistered) {
        trackPixel(
          "CompleteRegistration",
          { content_name: eventName ?? eventId, content_ids: [eventId], status: true },
          data.ticketCode ? `rsvp-${data.ticketCode}` : undefined
        );
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex animate-fade-up items-start gap-4 rounded-2xl bg-brand-600 p-6 text-black shadow-glow">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
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
              className="mt-4 inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-brand-500"
            >
              View my ticket
            </a>
          )}
        </div>
      </div>
    );
  }

  const fields = [
    { key: "name", label: "Full name", type: "text", placeholder: "Your name", icon: User, autoComplete: "name" },
    { key: "email", label: "Email", type: "email", placeholder: "you@email.com", icon: Mail, autoComplete: "email" },
    { key: "whatsapp", label: "WhatsApp number", type: "tel", placeholder: "+233 ...", icon: Phone, autoComplete: "tel" },
  ] as const;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-3">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {f.label}
            </span>
            <span className="group relative block">
              <f.icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-brand-500" />
              <input
                type={f.type}
                required
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full rounded-2xl border border-white/10 py-4 pl-11 pr-4 text-base text-white outline-none transition-all placeholder:text-zinc-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-4 focus:ring-brand-500/10"
              />
            </span>
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-4 text-base font-bold text-black transition-all hover:bg-brand-700 hover:shadow-glow disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Ticket className="h-5 w-5" />
        )}
        Reserve my spot
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
      {status === "error" && (
        <p className="mt-4 text-center text-sm text-danger">{errorMsg}</p>
      )}
    </form>
  );
}
