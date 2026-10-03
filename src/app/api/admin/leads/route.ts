import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const snap = await getAdminDb().collection("leads").get();
  const leads = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) =>
      String((b as { createdAt?: string }).createdAt).localeCompare(
        String((a as { createdAt?: string }).createdAt)
      )
    );

  return NextResponse.json({ leads });
}
