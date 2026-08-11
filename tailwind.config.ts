import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0D0F12",
          card: "#16191E",
          subtle: "#1B1F26",
        },
        border: {
          DEFAULT: "#2A2E37",
        },
        text: {
          primary: "#E5E7EB",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
        feedback: {
          correct: "#10B981",
          present: "#F59E0B",
          absent: "#22262F",
        },
        accent: {
          DEFAULT: "#6366F1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateX(0deg)" },
          "50%": { transform: "rotateX(90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        flip: "flip 0.5s ease",
        shake: "shake 0.4s ease",
        pop: "pop 0.15s ease",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.4)",
        glow: "0 0 0 1px rgba(99,102,241,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
