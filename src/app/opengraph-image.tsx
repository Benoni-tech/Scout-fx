import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Scout FX: trading education, community and signals";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Trading education · Ghana",
    title: "Trade smarter with",
    highlight: "real education",
    subtitle: "Structured lessons, free seminars and an active trader community.",
  });
}
