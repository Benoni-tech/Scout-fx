import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";
import { SEED_PROGRAM } from "@/lib/seedProgram";

export const alt = `${SEED_PROGRAM.name}: free trading training`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: SEED_PROGRAM.name,
    title: "Free trading",
    highlight: "training",
    subtitle: `Every eligible registrant gets the training. Some may also receive up to $${SEED_PROGRAM.seedAmount} seed capital.`,
    badge: "REGISTER FREE",
  });
}
