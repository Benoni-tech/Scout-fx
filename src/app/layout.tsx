import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = { themeColor: "#000000" };

export const metadata: Metadata = {
  title: "Scout FX | Trading Education, Community & Signals",
  description:
    "Structured trading education, an active trader community, and rule-based signals, built for traders in Ghana and beyond.",
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
      </body>
    </html>
  );
}
