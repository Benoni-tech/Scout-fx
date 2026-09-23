"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

type Props = {
  source: string; // where on the site this form lives, for attribution
  compact?: boolean;
};

export default function NewsletterForm({ source, compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        You&apos;re on the list. Check your inbox.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "flex w-full max-w-sm gap-2" : "w-full max-w-md"}
    >
      <div className={compact ? "flex flex-1 gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full flex-1 rounded-full border border-ink-100 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-danger">{errorMsg}</p>
      )}
    </form>
  );
}
