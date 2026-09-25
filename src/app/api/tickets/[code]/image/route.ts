import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getEventById } from "@/lib/events";
import { normalizeTicketCode } from "@/lib/tickets";
import { ticketImagePng } from "@/lib/ticketImage";

// Branded ticket PNG. Add ?download=1 to save it instead of viewing it.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = normalizeTicketCode((await params).code);
  if (!code) return new NextResponse("Not found", { status: 404 });

  const doc = await getAdminDb().collection("rsvps").doc(code).get();
  const event = doc.exists ? getEventById(doc.data()!.eventId) : undefined;
  if (!doc.exists || !event) return new NextResponse("Not found", { status: 404 });

  const png = await ticketImagePng({ id: code, name: doc.data()!.name }, event);
  const download = req.nextUrl.searchParams.has("download");

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=3600",
      ...(download
        ? { "Content-Disposition": `attachment; filename="scoutfx-ticket-${code}.png"` }
        : {}),
    },
  });
}
