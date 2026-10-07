import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminGuard";
import { normalizeTicketCode } from "@/lib/tickets";

// POST { code, restore? } -> cancel (or restore) a ticket. A cancelled ticket stays in
// the list but shows "Cancelled" at the gate and can't be admitted. Its email and
// number stay reserved, so the same person can't simply register again.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const code = normalizeTicketCode(String(body.code || ""));
  if (!code) return NextResponse.json({ error: "Missing ticket code." }, { status: 400 });

  const db = getAdminDb();
  const ref = db.collection("rsvps").doc(code);

  const error = await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) return "Ticket not found.";
    if (body.restore) {
      tx.update(ref, { cancelled: false, cancelledAt: null, cancelledBy: null });
      return "";
    }
    if (doc.data()!.attended) return "This guest is already checked in. Undo the check-in first.";
    tx.update(ref, { cancelled: true, cancelledAt: new Date().toISOString(), cancelledBy: admin.email });
    return "";
  });

  if (error) return NextResponse.json({ error }, { status: error === "Ticket not found." ? 404 : 409 });
  return NextResponse.json({ ok: true });
}
