import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#111111",
        charcoal: "#1a1a1a",

        // Luxury / editorial accent palette
        beige: {
          50: "#FBF8F3",
          100: "#F5EEE1",
          200: "#EADFC7",
          300: "#DCC9A3",
        },
        clay: {
          50: "#FBF7F2",
          100: "#F5EDE2",
          200: "#EADCC8",
          300: "#DCC6A6",
          400: "#C9A97D",
          500: "#B48B5C",
          600: "#9A7148",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F2EDE6",
          200: "#E5DCCE",
          300: "#D5C8B4",
        },
        cream: {
          50: "#FDFBF7",
          100: "#F8F3E9",
          200: "#F0E7D4",
        },
        stone: {
          50: "#F7F6F4",
          100: "#EDEBE6",
          200: "#DEDAD1",
          300: "#C4BEB1",
        },
        terracotta: {
          100: "#EFDACB",
          300: "#D8A582",
          500: "#B76E4D",
          600: "#9C5A3C",
        },
        olive: {
          50: "#F6F7F1",
          100: "#EAEDDF",
          200: "#D8DEC2",
          300: "#C0C99E",
        },
        greystone: {
          50: "#F7F7F6",
          100: "#ECEBE8",
          200: "#D9D7D1",
          300: "#B8B5AD",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 7.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wide: "0.08em",
        widest: "0.2em",
      },
      transitionTimingFunction: {
        studio: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        soft: "0 20px 60px -15px rgba(17, 17, 17, 0.15)",
        card: "0 10px 40px -10px rgba(17, 17, 17, 0.12)",
        glass: "0 8px 32px 0 rgba(17, 17, 17, 0.08)",
        lift: "0 30px 80px -20px rgba(17, 17, 17, 0.22)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        marquee: "marquee 30s linear infinite",
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
