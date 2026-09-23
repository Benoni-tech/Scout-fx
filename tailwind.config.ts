import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FCE79A",
          300: "#FAD764",
          400: "#FBC93A",
          500: "#FBBE22",
          600: "#FDBC14",
          700: "#C99400",
          800: "#8E620B",
          900: "#5E4108",
        },
        ink: {
          900: "#0B0B10",
          700: "#26262E",
          500: "#54545F",
          300: "#9A9AA5",
          100: "#E7E7EC",
        },
        success: "#16A34A",
        danger: "#DC2626",
      },
      boxShadow: {
        pill: "0 1px 2px rgba(11,11,16,0.04), 0 8px 24px rgba(11,11,16,0.06)",
        card: "0 1px 2px rgba(11,11,16,0.04), 0 12px 32px rgba(11,11,16,0.08)",
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(11,11,16,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "22px 22px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
