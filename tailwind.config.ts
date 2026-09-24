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
          50: "#FEFFE5",
          100: "#FDFFC2",
          200: "#FCFF8A",
          300: "#FBFF4D",
          400: "#FBFE1A",
          500: "#FBFE00",
          600: "#FBFE00",
          700: "#E3E600",
          800: "#5C5E00",
          900: "#3A3B00",
        },
        gold: {
          50: "#FEFFE5",
          100: "#FDFFC2",
          200: "#FCFF8A",
          300: "#FBFF4D",
          400: "#FBFE1A",
          500: "#FBFE00",
          600: "#FBFE00",
          700: "#E3E600",
          800: "#5C5E00",
          900: "#3A3B00",
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
