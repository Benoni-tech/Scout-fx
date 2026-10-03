import { ImageResponse } from "next/og";
import { LOGO_DATA_URL, LOGO_WIDTH, LOGO_HEIGHT } from "@/lib/logoData";
import { loadFonts } from "@/lib/brandFonts";

const Y = "#FBFE00";

// Facebook, WhatsApp, LinkedIn and X all use 1200x630 for large link previews.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type Detail = { label: string; value: string };

/**
 * Branded link-preview image. Text sits well inside the edges because some
 * apps crop previews to a square or a narrower ratio on mobile.
 */
export async function renderOgImage({
  eyebrow,
  title,
  highlight,
  subtitle,
  details = [],
  badge,
}: {
  eyebrow: string;
  title: string;
  /** Trailing words shown in yellow after the title, e.g. "2026". */
  highlight?: string;
  subtitle?: string;
  details?: Detail[];
  badge?: string;
}) {
  const length = `${title} ${highlight ?? ""}`.trim().length;
  const fontSize = length <= 22 ? 84 : length <= 34 ? 72 : 60;
  // One span per word so lines break between words and the highlight flows inline.
  const words = [
    ...title.split(/\s+/).map((w) => ({ w, hl: false })),
    ...(highlight ?? "").split(/\s+/).filter(Boolean).map((w) => ({ w, hl: true })),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 96px",
          background: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 85% 0%, rgba(251,254,0,0.20), transparent), radial-gradient(ellipse 50% 50% at 0% 100%, rgba(251,254,0,0.07), transparent)",
          fontFamily: "Manrope",
          color: "#FFFFFF",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DATA_URL} width={LOGO_WIDTH / 3.4} height={LOGO_HEIGHT / 3.4} alt="" />
            <div style={{ marginLeft: 14, fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>SCOUT FX</div>
          </div>
          {badge && (
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: Y,
                color: "#000000",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 5, color: Y }}>{eyebrow.toUpperCase()}</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 14,
              fontSize,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -2.5,
            }}
          >
            {words.map(({ w, hl }, i) => (
              <span key={i} style={{ color: hl ? Y : "#FFFFFF", marginRight: fontSize * 0.26 }}>
                {w}
              </span>
            ))}
          </div>
          {subtitle && (
            <div style={{ marginTop: 18, fontSize: 30, color: "#A1A1AA", lineHeight: 1.3 }}>{subtitle}</div>
          )}
        </div>

        {/* details */}
        {details.length > 0 ? (
          <div style={{ display: "flex", borderTop: "2px solid #27272A", paddingTop: 26 }}>
            {details.map((d, i) => (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: i === details.length - 1 ? 1.4 : 1,
                }}
              >
                <div style={{ fontSize: 18, letterSpacing: 3, color: "#71717A" }}>{d.label.toUpperCase()}</div>
                <div style={{ marginTop: 6, fontSize: 30, fontWeight: 700 }}>{d.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", fontSize: 24, color: "#71717A" }}>scoutsfx.com</div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  );
}
