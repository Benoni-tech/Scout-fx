import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminGuard";
import { SEED_PROGRAM, SEED_STATUSES } from "@/lib/seedProgram";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const snap = await getAdminDb().collection("applications").get();
  const applications = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) =>
      String((b as { createdAt?: string }).createdAt).localeCompare(
        String((a as { createdAt?: string }).createdAt)
      )
    );

  return NextResponse.json({ applications });
}

// Update a registration's status (and optional seed amount / note).
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const { id, status, seedAmount, note } = await req.json();
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  if (!SEED_STATUSES.some((s) => s.value === status)) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  const ref = getAdminDb().collection("applications").doc(id);
  if (!(await ref.get()).exists) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  const update: Record<string, unknown> = {
    status,
    statusUpdatedAt: new Date().toISOString(),
    statusUpdatedBy: admin.email,
  };
  if (status === "seed_awarded") {
    const amt = Number(seedAmount);
    if (!Number.isFinite(amt) || amt <= 0 || amt > SEED_PROGRAM.seedAmount) {
      return NextResponse.json({ error: `Seed amount must be between 1 and ${SEED_PROGRAM.seedAmount}.` }, { status: 400 });
    }
    update.seedAmount = amt;
  }
  if (typeof note === "string") update.note = note.trim().slice(0, 1000);

  await ref.update(update);
  return NextResponse.json({ ok: true });
}
