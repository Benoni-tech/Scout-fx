import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Join the Scout FX community for free";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Scout FX community",
    title: "Join the",
    highlight: "community",
    subtitle: "Weekly education, first word on seminars, and no pressure to trade.",
    badge: "FREE",
  });
}
