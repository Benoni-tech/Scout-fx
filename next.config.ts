import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // fonts read at runtime by the ticket image renderer (src/lib/ticketImage.tsx)
  outputFileTracingIncludes: {
    "/api/tickets/[code]/image": ["./src/lib/fonts/**"],
    "/api/rsvp": ["./src/lib/fonts/**"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
