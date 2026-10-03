import { getEventById, upcomingEvents } from "@/lib/events";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";
import { eventTime, shortEventDate } from "@/lib/seo";

export const alt = "Scout FX event";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return upcomingEvents.map((e) => ({ id: e.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) return renderOgImage({ eyebrow: "Scout FX", title: "Seminars &", highlight: "workshops" });

  // "Forex Trading Conference 2026" -> year in yellow
  const m = event.title.match(/^(.*?)\s(\d{4})$/);
  return renderOgImage({
    eyebrow: event.presentedBy ? `Presented by ${event.presentedBy}` : "Scout FX event",
    title: m ? m[1] : event.title,
    highlight: m ? m[2] : undefined,
    subtitle: event.theme,
    badge: event.free ? "FREE ENTRY" : undefined,
    details: [
      { label: "Date", value: shortEventDate(event) },
      { label: "Time", value: eventTime(event) },
      { label: "Venue", value: event.location },
    ],
  });
}
