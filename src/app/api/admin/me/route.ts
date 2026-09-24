import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json({ email: admin.email });
}
