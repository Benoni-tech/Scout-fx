"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import MediaBrowser, { type PickedImage } from "@/components/admin/media/MediaBrowser";

/** Full-screen "choose or upload an image" dialog used by the article editor. */
export default function MediaPicker({
  open,
  title,
  pickLabel,
  onClose,
  onPick,
}: {
  open: boolean;
  title: string;
  pickLabel: string;
  onClose: () => void;
  onPick: (img: PickedImage) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <p className="text-sm font-bold text-white">{title}</p>
        <button onClick={onClose} className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-sm text-white hover:bg-white/5">
          <X className="h-4 w-4" /> Close
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <MediaBrowser mode="pick" pickLabel={pickLabel} onPick={onPick} />
      </div>
    </div>,
    document.body
  );
}
