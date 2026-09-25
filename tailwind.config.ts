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
        pill: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.5)",
        card: "0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 50px rgba(0,0,0,0.6)",
        glow: "0 0 40px rgba(251,254,0,0.25)",
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "22px 22px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        draw: {
          from: { strokeDashoffset: "1000" },
          to: { strokeDashoffset: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 40s linear infinite",
        draw: "draw 2.4s ease-out both",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
