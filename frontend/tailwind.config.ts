import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        mint: "#3ef7b3",
        aqua: "#2ee9e1",
        graphite: "#101827"
      },
      boxShadow: {
        glow: "0 0 48px rgba(62, 247, 179, 0.22)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulsebar: {
          "0%, 100%": { transform: "scaleX(0.45)", opacity: "0.55" },
          "50%": { transform: "scaleX(1)", opacity: "1" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 700ms ease both",
        pulsebar: "pulsebar 1.2s ease-in-out infinite",
        float: "float 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
