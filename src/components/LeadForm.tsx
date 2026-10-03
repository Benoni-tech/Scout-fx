"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import Honeypot, { honeypotValue } from "@/components/Honeypot";

export default function LeadForm({ source }: { source: string }) {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const company = honeypotValue(e);
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-brand-600 bg-brand-600 p-5 text-black">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">You&apos;re in.</p>
          <p className="text-sm">Check your inbox for a welcome email.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Honeypot />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-brand-400"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@email.com"
          className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-brand-400"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          WhatsApp <span className="text-danger">*</span>
        </label>
        <input
          type="tel"
          required
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          placeholder="+233 ..."
          className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-brand-400"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Join free
      </button>

      {status === "error" && (
        <p className="text-center text-sm text-danger">{errorMsg}</p>
      )}
      <p className="text-center text-xs text-zinc-500">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
