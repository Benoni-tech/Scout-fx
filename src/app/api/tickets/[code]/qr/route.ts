import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { normalizeTicketCode, ticketQrPng } from "@/lib/tickets";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = normalizeTicketCode((await params).code);
  if (!code) return new NextResponse("Not found", { status: 404 });

  const doc = await getAdminDb().collection("rsvps").doc(code).get();
  if (!doc.exists) return new NextResponse("Not found", { status: 404 });

  const png = await ticketQrPng(code);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
