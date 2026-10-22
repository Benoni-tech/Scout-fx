"use client";

import { useEffect } from "react";

const WINDOW_MS = 30 * 60 * 1000;

/** Counts one view of an article per browser every 30 minutes. Renders nothing. */
export default function ViewBeacon({ postId }: { postId: string }) {
  useEffect(() => {
    // Local testing would count against the live database.
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return;
    const key = `viewed:${postId}`;
    try {
      const last = Number(localStorage.getItem(key)) || 0;
      if (Date.now() - last < WINDOW_MS) return;
      localStorage.setItem(key, String(Date.now()));
    } catch {
      // storage blocked: count it anyway
    }
    fetch("/api/blog/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
      keepalive: true,
    }).catch(() => {});
  }, [postId]);
  return null;
}
