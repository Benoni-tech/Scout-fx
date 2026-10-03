import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import type { EventItem } from "@/lib/events";
import { checkinUrl } from "@/lib/tickets";
import { LOGO_DATA_URL, LOGO_WIDTH, LOGO_HEIGHT } from "@/lib/logoData";
import { loadFonts } from "@/lib/brandFonts";

const Y = "#FBFE00";
const W = 800;
const H = 1500;

/** Splits "Saturday, October 31, 2026 · 11:00 AM GMT" into date and time. */
function splitDate(date: string) {
  const [d, t] = date.split(" · ");
  return { day: d, time: t ?? "" };
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ fontSize: 18, letterSpacing: 3, color: "#71717A", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25 }}>
        {value}
      </div>
    </div>
  );
}

/** Branded, phone-sized ticket PNG (attached to the email and downloadable from the ticket page). */
export async function renderTicketImage(
  rsvp: { id: string; name: string },
  event: EventItem
) {
  const qr = await QRCode.toDataURL(checkinUrl(rsvp.id), {
    width: 420,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: Y },
  });
  const { day, time } = splitDate(event.date);
  const yearMatch = event.title.match(/^(.*?)(\s\d{4})$/);
  const titleMain = yearMatch ? yearMatch[1] : event.title;
  const titleYear = yearMatch ? yearMatch[2] : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 28,
          background: "#000000",
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: 40,
            border: "2px solid #27272A",
            background: "#0A0A0B",
            backgroundImage: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(251,254,0,0.22), transparent)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 48px 0" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_DATA_URL} width={LOGO_WIDTH / 3.6} height={LOGO_HEIGHT / 3.6} alt="" />
              <div style={{ marginLeft: 14, fontSize: 30, fontWeight: 800, color: "#FFFFFF", letterSpacing: -0.5 }}>
                SCOUT FX
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                background: Y,
                color: "#000000",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              ADMIT ONE
            </div>
          </div>

          {/* title */}
          <div style={{ display: "flex", flexDirection: "column", padding: "56px 48px 0" }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 4, color: Y }}>
              {event.free ? "FREE ENTRY TICKET" : "ENTRY TICKET"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
              <span style={{ color: "#FFFFFF" }}>{titleMain}</span>
              {titleYear && <span style={{ color: Y }}>{titleYear}</span>}
            </div>
            {event.presentedBy && (
              <div style={{ marginTop: 16, fontSize: 22, color: "#A1A1AA" }}>
                {`Presented by ${event.presentedBy}`}
              </div>
            )}
          </div>

          {/* details */}
          <div style={{ display: "flex", flexDirection: "column", padding: "48px 48px 0" }}>
            <div style={{ display: "flex" }}>
              <Field label="Date" value={day} />
            </div>
            <div style={{ display: "flex", marginTop: 32 }}>
              <Field label="Time" value={time || "-"} />
              <Field label="Venue" value={event.location} />
            </div>
            <div style={{ display: "flex", marginTop: 32 }}>
              <Field label="Attendee" value={rsvp.name} />
            </div>
          </div>

          {/* perforation with notches */}
          <div style={{ display: "flex", alignItems: "center", marginTop: 48, position: "relative", height: 40 }}>
            <div style={{ position: "absolute", left: -22, width: 44, height: 44, borderRadius: 999, background: "#000000", border: "2px solid #27272A" }} />
            <div style={{ display: "flex", flex: 1, margin: "0 40px", borderTop: "3px dashed #3F3F46" }} />
            <div style={{ position: "absolute", right: -22, width: 44, height: 44, borderRadius: 999, background: "#000000", border: "2px solid #27272A" }} />
          </div>

          {/* QR stub */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 48px 0" }}>
            <div style={{ display: "flex", padding: 20, borderRadius: 32, background: Y }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} width={300} height={300} alt="" />
            </div>
            <div style={{ marginTop: 28, fontSize: 18, letterSpacing: 4, color: "#71717A" }}>TICKET CODE</div>
            <div style={{ marginTop: 6, fontSize: 44, fontWeight: 800, letterSpacing: 10, color: "#FFFFFF" }}>
              {rsvp.id}
            </div>
            <div style={{ marginTop: 18, fontSize: 20, color: "#A1A1AA" }}>
              Show this at the gate · valid for one entry
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H, fonts: await loadFonts() }
  );
}

/** PNG bytes of the ticket, for email attachments. */
export async function ticketImagePng(rsvp: { id: string; name: string }, event: EventItem) {
  const res = await renderTicketImage(rsvp, event);
  return Buffer.from(await res.arrayBuffer());
}
