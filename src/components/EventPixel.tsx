"use client";

import { useMemo } from "react";
import PagePixel from "@/components/PagePixel";

/** Meta Pixel on an event page (PageView + ViewContent for that event). */
export default function EventPixel({ eventId, eventName }: { eventId: string; eventName: string }) {
  const ids = useMemo(() => [eventId], [eventId]);
  return <PagePixel contentName={eventName} contentType="event" contentIds={ids} />;
}
