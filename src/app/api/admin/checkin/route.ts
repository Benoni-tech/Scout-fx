import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminGuard";
import { getEventById } from "@/lib/events";
import { normalizeTicketCode } from "@/lib/tickets";

// GET ?code=XXXX  -> look up a ticket without admitting it
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const code = normalizeTicketCode(req.nextUrl.searchParams.get("code") || "");
  const doc = code
    ? await getAdminDb().collection("rsvps").doc(code).get()
    : null;
  if (!doc?.exists) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  const data = doc.data()!;
  return NextResponse.json({
    rsvp: { id: doc.id, ...data },
    eventTitle: getEventById(data.eventId)?.title ?? data.eventId,
  });
}

// POST { code, undo? } -> admit (or un-admit) a ticket. Admitting is atomic,
// so two staff scanning the same ticket can't both let it in.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  const code = normalizeTicketCode(String(body.code || ""));
  if (!code) {
    return NextResponse.json({ error: "Missing ticket code." }, { status: 400 });
  }

  const db = getAdminDb();
  const ref = db.collection("rsvps").doc(code);

  const result = await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) return { status: 404 as const };
    const data = doc.data()!;

    if (body.undo) {
      tx.update(ref, { attended: false, checkedInAt: null, checkedInBy: null });
      return { status: 200 as const, alreadyCheckedIn: false };
    }
    if (data.attended) {
      return {
        status: 409 as const,
        checkedInAt: data.checkedInAt,
        checkedInBy: data.checkedInBy,
      };
    }
    tx.update(ref, {
      attended: true,
      checkedInAt: new Date().toISOString(),
      checkedInBy: admin.email,
    });
    return { status: 200 as const, alreadyCheckedIn: false };
  });

  if (result.status === 404) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }
  if (result.status === 409) {
    return NextResponse.json(
      {
        error: "Already checked in.",
        checkedInAt: result.checkedInAt,
        checkedInBy: result.checkedInBy,
      },
      { status: 409 }
    );
  }
  return NextResponse.json({ ok: true });
}
