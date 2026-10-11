import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { upcomingEvents } from "@/lib/events";
import { registrationStates, setRegistrationOpen, type RegistrationKey } from "@/lib/registration";

const KEYS: RegistrationKey[] = ["seed", ...upcomingEvents.map((e) => `event:${e.id}` as const)];

// GET -> open/closed state of the Seed Program and every event
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json({ states: await registrationStates(KEYS) });
}

// POST { key, open } -> open or close registration
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const body = await req.json().catch(() => ({}));
  if (!KEYS.includes(body.key) || typeof body.open !== "boolean") {
    return NextResponse.json({ error: "Unknown program or event." }, { status: 400 });
  }
  await setRegistrationOpen(body.key, body.open, admin.email);
  return NextResponse.json({ ok: true });
}
