import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const db = getAdminDb();
  const [leads, rsvps, checkedIn] = await Promise.all([
    db.collection("leads").count().get(),
    db.collection("rsvps").count().get(),
    db.collection("rsvps").where("attended", "==", true).count().get(),
  ]);

  return NextResponse.json({
    leads: leads.data().count,
    rsvps: rsvps.data().count,
    checkedIn: checkedIn.data().count,
    email: admin.email,
  });
}
