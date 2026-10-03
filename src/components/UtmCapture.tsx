"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

/** Remembers which link a visitor arrived from, whatever page they land on. */
export default function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
