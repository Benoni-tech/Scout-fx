"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CodeEntry() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!clean) return;
    setCode("");
    router.push(`/admin/checkin/${clean}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Ticket code"
        autoCapitalize="characters"
        autoComplete="off"
        className="w-full flex-1 rounded-full border border-ink-100 px-4 py-2.5 font-mono text-sm uppercase tracking-widest text-ink-900 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-300 focus:border-brand-400"
      />
      <button
        type="submit"
        className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white"
      >
        Look up
      </button>
    </form>
  );
}
