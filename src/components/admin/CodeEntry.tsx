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
        className="w-full flex-1 rounded-full border border-white/10 px-4 py-2.5 font-mono text-sm uppercase tracking-widest text-white placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 focus:border-brand-400"
      />
      <button
        type="submit"
        className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
      >
        Look up
      </button>
    </form>
  );
}
