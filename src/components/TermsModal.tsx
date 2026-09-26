"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, X } from "lucide-react";
import type { TermsSection } from "@/lib/seedProgram";

export default function TermsModal({
  open,
  title,
  version,
  sections,
  onClose,
  onAccept,
}: {
  open: boolean;
  title: string;
  version: string;
  sections: TermsSection[];
  onClose: () => void;
  onAccept: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const onScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 1);
  };

  // Portal to <body>: ancestors with transforms (scroll reveals, blur) would
  // otherwise trap this fixed overlay inside them.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl animate-fade-up flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-950 shadow-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* reading progress */}
        <div className="h-1 w-full bg-white/5">
          <div className="h-full bg-brand-500 transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-black">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 id="terms-title" className="text-lg font-bold text-white">
                Terms &amp; Conditions
              </h2>
              <p className="text-xs text-zinc-500">
                {title} · Version {version}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-500 hover:text-brand-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={bodyRef} onScroll={onScroll} className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h3 className="text-sm font-bold text-white">{s.heading}</h3>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-black/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-brand-700 hover:shadow-glow"
          >
            I agree to these terms
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
