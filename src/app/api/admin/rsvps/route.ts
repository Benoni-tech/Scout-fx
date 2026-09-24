import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId." }, { status: 400 });
  }

  const snap = await getAdminDb()
    .collection("rsvps")
    .where("eventId", "==", eventId)
    .get();

  const rsvps = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) =>
      String((b as { createdAt?: string }).createdAt).localeCompare(
        String((a as { createdAt?: string }).createdAt)
      )
    );

  return NextResponse.json({ rsvps });
}
