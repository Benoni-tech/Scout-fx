import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UtmCapture from "@/components/UtmCapture";
import { SITE_URL } from "@/lib/tickets";
import { SITE_NAME } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = { themeColor: "#000000" };

export const metadata: Metadata = {
  // Makes generated image and canonical URLs absolute, as link previews require.
  metadataBase: new URL(SITE_URL),
  title: { default: "Scout FX | Trading Education, Community & Signals", template: "%s | Scout FX" },
  description:
    "Structured trading education, an active trader community, and rule-based signals, built for traders in Ghana and beyond.",
  // Fallback for pages without their own tags. No url here, or every page would claim the home page's.
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="relative font-sans antialiased">
        <div className="spotlight pointer-events-none absolute inset-x-0 top-0 h-[520px]" aria-hidden />
        <Navbar />
        <main className="relative pt-24">{children}</main>
        <Footer />
        <UtmCapture />
      </body>
    </html>
  );
}
