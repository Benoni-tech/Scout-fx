import { readFile } from "fs/promises";
import { join } from "path";

type Font = { name: string; data: Buffer; weight: 400 | 700 | 800; style: "normal" };

// Manrope (the site font), bundled so generated images match the website.
// Included in serverless bundles via outputFileTracingIncludes in next.config.ts.
let fonts: Promise<Font[]> | undefined;
export function loadFonts() {
  return (fonts ??= Promise.all(
    ([400, 700, 800] as const).map(async (weight) => ({
      name: "Manrope",
      data: await readFile(join(process.cwd(), "src/lib/fonts", `manrope-${weight}.woff`)),
      weight,
      style: "normal" as const,
    }))
  ));
}
