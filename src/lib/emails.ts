import { sendEmail, FROM_EMAIL, REPLY_TO_EMAIL } from "@/lib/resend";
import type { EventItem } from "@/lib/events";
import { SITE_URL, ticketUrl, type Rsvp } from "@/lib/tickets";
import { ticketImagePng } from "@/lib/ticketImage";
import { SEED_PROGRAM } from "@/lib/seedProgram";

const Y = "#FBFE00";
const FONT =
  "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function button(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr><td bgcolor="${Y}" style="border-radius:999px;">
        <a href="${href}" style="display:inline-block; padding:14px 28px; font-family:${FONT}; font-size:15px; font-weight:700; color:#000000; text-decoration:none; border-radius:999px;">${label}</a>
      </td></tr>
    </table>`;
}

/**
 * Dark, branded wrapper shared by every email. Table-based with inline styles
 * so it renders in Gmail, Outlook and Apple Mail.
 */
export function emailLayout({ preheader, body }: { preheader: string; body: string }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Scout FX</title>
</head>
<body style="margin:0; padding:0; background:#000000;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background:#000000;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr><td style="padding:0 8px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:middle;"><img src="${SITE_URL}/logo.png" width="22" height="25" alt="" style="display:block; border:0;" /></td>
            <td style="vertical-align:middle; padding-left:10px; font-family:${FONT}; font-size:17px; font-weight:800; letter-spacing:-0.3px; color:#FFFFFF;">SCOUT FX</td>
          </tr></table>
        </td></tr>
        <tr><td bgcolor="#0A0A0B" style="background:#0A0A0B; border:1px solid #27272A; border-radius:24px; overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="4" bgcolor="${Y}" style="background:${Y}; font-size:0; line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:36px 32px; font-family:${FONT}; color:#D4D4D8;">
              ${body}
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:28px 16px 0; text-align:center; font-family:${FONT}; font-size:12px; line-height:1.7; color:#71717A;">
          <span style="color:#FFFFFF; font-weight:700;">We scout opportunities and make <span style="color:${Y};">trading easier.</span></span><br />
          <a href="${SITE_URL}" style="color:#A1A1AA; text-decoration:underline;">scoutsfx.com</a>
          &nbsp;·&nbsp; Trading carries a high level of risk.
          <a href="${SITE_URL}/legal/risk-disclosure" style="color:#A1A1AA; text-decoration:underline;">Risk disclosure</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:12px 0; border-top:1px solid #27272A; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#71717A; width:110px; vertical-align:top;">${label}</td>
      <td style="padding:12px 0; border-top:1px solid #27272A; font-size:15px; font-weight:700; color:#FFFFFF;">${value}</td>
    </tr>`;
}

/** HTML for the ticket email; the ticket image is referenced as cid:ticket. */
export function ticketEmailHtml(rsvp: Pick<Rsvp, "id" | "name">, event: EventItem) {
  const name = escapeHtml(rsvp.name);
  const firstName = escapeHtml(rsvp.name.split(" ")[0] || rsvp.name);

  const body = `
    <p style="margin:0; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:${Y};">You're registered</p>
    <h1 style="margin:10px 0 0; font-size:28px; line-height:1.15; font-weight:800; letter-spacing:-0.5px; color:#FFFFFF;">See you there, ${firstName}.</h1>
    <p style="margin:14px 0 0; font-size:15px; line-height:1.65; color:#A1A1AA;">
      Your ticket for <strong style="color:#FFFFFF;">${escapeHtml(event.title)}</strong> is below.
      Show the QR code at the gate. It's also attached as an image, so you can open it without internet.
    </p>

    <div style="margin:28px 0 0; text-align:center;">
      <img src="cid:ticket" width="400" alt="Your ticket, code ${rsvp.id}" style="display:block; width:100%; max-width:400px; height:auto; margin:0 auto; border:0; border-radius:20px;" />
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0; font-family:${FONT};">
      ${detailRow("Ticket code", `<span style="letter-spacing:4px; color:${Y};">${rsvp.id}</span>`)}
      ${detailRow("When", escapeHtml(event.date))}
      ${detailRow("Where", escapeHtml(event.location))}
      ${detailRow("Name", name)}
    </table>

    <div style="margin:32px 0 0;">${button(ticketUrl(rsvp.id), "View ticket online &rarr;")}</div>

    <p style="margin:28px 0 0; font-size:12px; line-height:1.7; color:#71717A; text-align:center;">
      This ticket admits one person and can be used once.<br />
      Questions? WhatsApp ${escapeHtml(event.contactPhone)} or reply to this email.
    </p>`;

  return emailLayout({
    preheader: `Your ticket for ${event.title} · ${event.date}`,
    body,
  });
}

export async function sendTicketEmail(rsvp: Rsvp, event: EventItem) {
  const png = await ticketImagePng(rsvp, event);

  await sendEmail({
    from: FROM_EMAIL,
    to: rsvp.email,
    replyTo: REPLY_TO_EMAIL,
    subject: `Your ticket: ${event.title}`,
    attachments: [
      { filename: `scoutfx-ticket-${rsvp.id}.png`, content: png, inlineContentId: "ticket" },
    ],
    html: ticketEmailHtml(rsvp, event),
  });
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const first = name ? escapeHtml(name.split(" ")[0]) : "";

  const body = `
    <p style="margin:0; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:${Y};">Welcome to Scout FX</p>
    <h1 style="margin:10px 0 0; font-size:28px; line-height:1.15; font-weight:800; letter-spacing:-0.5px; color:#FFFFFF;">You're in${first ? `, ${first}` : ""}.</h1>
    <p style="margin:14px 0 0; font-size:15px; line-height:1.65; color:#A1A1AA;">
      You'll hear about upcoming seminars, new education content and community updates. No spam, ever.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0; font-family:${FONT};">
      ${[
        ["01", "Learn", "Start with the education library: risk, charts, psychology.", `${SITE_URL}/education`],
        ["02", "Show up", "Join a free seminar and meet the community.", `${SITE_URL}/events`],
        ["03", "Check the record", "Every signal is logged, wins and losses.", `${SITE_URL}/signals`],
      ]
        .map(
          ([n, t, d, href]) => `
        <tr><td style="padding:14px 0; border-top:1px solid #27272A;">
          <a href="${href}" style="text-decoration:none;">
            <span style="font-size:22px; font-weight:300; color:${Y};">${n}</span>
            <span style="font-size:15px; font-weight:700; color:#FFFFFF; padding-left:10px;">${t}</span><br />
            <span style="font-size:13px; line-height:1.6; color:#A1A1AA; padding-left:38px;">${d}</span>
          </a>
        </td></tr>`
        )
        .join("")}
    </table>
    <div style="margin:32px 0 0;">${button(`${SITE_URL}/education`, "Start learning &rarr;")}</div>`;

  await sendEmail({
    from: FROM_EMAIL,
    to,
    replyTo: REPLY_TO_EMAIL,
    subject: "Welcome to the Scout FX community",
    html: emailLayout({ preheader: "You're in. Here's where to start.", body }),
  });
}

type SeedRegistration = { ref: string; name: string; email: string };

/** HTML for the Seed Program registration confirmation. */
export function applicationEmailHtml(app: SeedRegistration) {
  const first = escapeHtml(app.name.split(" ")[0] || app.name);

  const body = `
    <p style="margin:0; font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:${Y};">You're registered</p>
    <h1 style="margin:10px 0 0; font-size:28px; line-height:1.15; font-weight:800; letter-spacing:-0.5px; color:#FFFFFF;">Your training place is confirmed, ${first}.</h1>
    <p style="margin:14px 0 0; font-size:15px; line-height:1.65; color:#A1A1AA;">
      Thanks for registering for the <strong style="color:#FFFFFF;">${escapeHtml(SEED_PROGRAM.name)}</strong>.
      Your place in the free training is guaranteed, and we'll send you the schedule by email or WhatsApp.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0; font-family:${FONT};">
      ${detailRow("Reference", `<span style="letter-spacing:3px; color:${Y};">${app.ref}</span>`)}
      ${detailRow("Program", escapeHtml(SEED_PROGRAM.name))}
      ${detailRow("Training", "Free · place confirmed")}
      ${detailRow("Seed capital", `Up to USD ${SEED_PROGRAM.seedAmount}, at Scout FX's discretion`)}
    </table>
    <p style="margin:24px 0 0; font-size:14px; line-height:1.65; color:#A1A1AA;">
      While you wait, get a head start in the education library.
    </p>
    <div style="margin:24px 0 0;">${button(`${SITE_URL}/education`, "Start learning &rarr;")}</div>
    <p style="margin:28px 0 0; font-size:12px; line-height:1.7; color:#71717A; text-align:center;">
      Registration guarantees training only. Seed capital is awarded at Scout FX's sole discretion and is not guaranteed. Trading carries risk.
    </p>`;

  return emailLayout({ preheader: `Your training place is confirmed. Reference ${app.ref}.`, body });
}

/** Sent as soon as someone registers for the Seed Program (see /api/applications). */
export async function sendApplicationEmail(app: SeedRegistration) {
  await sendEmail({
    from: FROM_EMAIL,
    to: app.email,
    replyTo: REPLY_TO_EMAIL,
    subject: `You're registered: ${SEED_PROGRAM.name}`,
    html: applicationEmailHtml(app),
  });
}
