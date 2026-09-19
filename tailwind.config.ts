import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Öffentliche Website: Logo-Palette (Graphit · Elfenbein · Champagner-Gold)
        graphite: {
          950: "#0B0C0E",
          900: "#121417",
          800: "#1A1D21",
          700: "#24282E",
          600: "#2F343B",
          500: "#4A5058",
          400: "#6B727C",
          300: "#9AA1AA",
        },
        ivory: {
          DEFAULT: "#F6F2EA",
          50: "#FBF9F4",
          100: "#F6F2EA",
          200: "#EFE8DB",
          300: "#E4DACA",
        },
        sand: "#DED5C4",
        ink: { DEFAULT: "#15171A", 700: "#3F444B", 500: "#6B7079" },
        gold: {
          DEFAULT: "#C2A057",
          50: "#FBF6E9",
          100: "#F3E8C8",
          200: "#E9D9A6",
          300: "#DCC585",
          400: "#CFB16A",
          500: "#C2A057",
          600: "#A98847",
          700: "#8A6E38",
          light: "#E8C96A",
          dark: "#9A7A2E",
          muted: "rgba(201,168,76,0.15)",
        },
        // Admin-Panel nutzt Hex-Literale und die Klassen .card/.btn-primary/.btn-outline – keine Farbtokens.
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-display-serif)", "Georgia", "serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "hero-settle": "heroSettle 1.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "hero-sweep": "heroSweep 14s cubic-bezier(0.45,0,0.2,1) 1.1s infinite",
        "rise": "rise 0.9s cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        heroSettle: {
          "0%": { transform: "scale(1.06) translateX(1.5%)", opacity: "0.001" },
          "100%": { transform: "scale(1) translateX(0)", opacity: "1" },
        },
        heroSweep: {
          "0%": { transform: "translateX(-130%) skewX(-14deg)", opacity: "0" },
          "4%": { opacity: "1" },
          "18%": { transform: "translateX(130%) skewX(-14deg)", opacity: "1" },
          "19%, 100%": { transform: "translateX(130%) skewX(-14deg)", opacity: "0" },
        },
        rise: {
          "0%": { transform: "translateY(28px)", opacity: "0.001" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
        "card-hover": "0 4px 12px rgba(15,23,42,0.1), 0 16px 40px rgba(15,23,42,0.08)",
        "surface": "0 1px 2px rgba(21,23,26,0.05), 0 12px 32px -12px rgba(21,23,26,0.12)",
        "surface-hover": "0 2px 4px rgba(21,23,26,0.06), 0 24px 48px -16px rgba(21,23,26,0.22)",
        "gold": "0 8px 30px -8px rgba(194,160,87,0.55)",
        "stage": "0 -24px 60px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
