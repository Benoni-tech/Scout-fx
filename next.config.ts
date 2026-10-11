import type { NextConfig } from "next";
import { SIGNALS_LIVE } from "./src/lib/features";

const nextConfig: NextConfig = {
  // fonts read at runtime by the ticket image renderer (src/lib/ticketImage.tsx)
  outputFileTracingIncludes: {
    "/api/tickets/[code]/image": ["./src/lib/fonts/**"],
    "/api/rsvp": ["./src/lib/fonts/**"],
    // link-preview images (opengraph-image.tsx) use the same font
    "/opengraph-image*": ["./src/lib/fonts/**"],
    "/**/opengraph-image*": ["./src/lib/fonts/**"],
  },
  // Only local images are used, so the image optimizer isn't open to other sites.
  poweredByHeader: false,
  // Until signals launch, their sub-pages (which hold sample data) aren't served at all.
  async redirects() {
    if (SIGNALS_LIVE) return [];
    return ["history", "dashboard", "disclosure"].map((p) => ({
      source: `/signals/${p}`,
      destination: "/signals",
      permanent: false,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // admin pages and private ticket data should never be cached or indexed
        source: "/(admin|ticket)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
