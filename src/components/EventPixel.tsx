"use client";

import { useEffect } from "react";
import { META_PIXEL_ID, initPixel, trackPixel } from "@/lib/metaPixel";

/**
 * Loads the Meta Pixel on an event page and records the visit.
 * Re-runs every time the page mounts, so client-side navigation back to the
 * event page counts as a new PageView.
 */
export default function EventPixel({ eventId, eventName }: { eventId: string; eventName: string }) {
  useEffect(() => {
    if (!initPixel()) return;
    trackPixel("PageView");
    trackPixel("ViewContent", {
      content_name: eventName,
      content_ids: [eventId],
      content_type: "event",
    });
  }, [eventId, eventName]);

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
