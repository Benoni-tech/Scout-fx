import { unstable_cache } from "next/cache";
import { getAdminDb } from "@/lib/firebaseAdmin";

// Headline numbers for an event report: tickets issued (cancelled ones left out)
// and tickets scanned at the gate. Cached for a day; past events don't change.

async function readStats(eventId: string) {
  try {
    const snap = await getAdminDb().collection("rsvps").where("eventId", "==", eventId).select("attended", "cancelled").get();
    let registered = 0;
    let checkedIn = 0;
    for (const d of snap.docs) {
      if (d.get("cancelled")) continue;
      registered++;
      if (d.get("attended")) checkedIn++;
    }
    return { registered, checkedIn };
  } catch (err) {
    console.error("Couldn't read event stats:", err);
    return null;
  }
}

export const eventStats = unstable_cache(readStats, ["event-stats"], { revalidate: 86_400 });
