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
  // The image optimizer only handles our own files and blog images in our Firebase
  // Storage bucket, so it can't be used as an open proxy for other sites.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: `/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/**`,
      },
    ],
  },
  poweredByHeader: false,
  // Until signals launch, their sub-pages (which hold sample data) aren't served at all.
  async redirects() {
    // The old Education section is now the blog.
    const blog = [
      { source: "/education", destination: "/blog", permanent: true },
      { source: "/education/:slug*", destination: "/blog", permanent: true },
    ];
    if (SIGNALS_LIVE) return blog;
    return [
      ...blog,
      ...["history", "dashboard", "disclosure"].map((p) => ({
        source: `/signals/${p}`,
        destination: "/signals",
        permanent: false,
      })),
    ];
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
