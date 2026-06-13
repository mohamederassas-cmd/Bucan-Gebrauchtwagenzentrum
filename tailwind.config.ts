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
        navy: {
          DEFAULT: "#1E3A8A",
          dark: "#172554",
          light: "#3B82F6",
        },
        accent: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        // Admin panel legacy tokens
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C96A",
          dark: "#9A7A2E",
          muted: "rgba(201,168,76,0.15)",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          100: "#111111",
          200: "#1A1A1A",
          300: "#222222",
          400: "#2D2D2D",
        },
        silver: "#A8A9AD",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
        "hero-gradient": "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
        "card-gradient": "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-accent": "pulseAccent 2s ease-in-out infinite",
        "shine": "shine 3s ease-in-out infinite",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseAccent: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37,99,235,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(37,99,235,0)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)",
        "card-hover": "0 4px 12px rgba(15,23,42,0.1), 0 16px 40px rgba(15,23,42,0.08)",
        "accent": "0 4px 20px rgba(37,99,235,0.35)",
        "accent-lg": "0 8px 40px rgba(37,99,235,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
