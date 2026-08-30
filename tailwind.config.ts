import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080b",
          900: "#0c0d12",
          800: "#14161e",
          700: "#1c1f2a",
          600: "#2a2e3d",
        },
        star: {
          DEFAULT: "#e8e4dc",
          dim: "#9a958c",
          mute: "#5c5852",
        },
        gold: {
          DEFAULT: "#c9a36a",
          bright: "#e4c48a",
          dim: "#8a6d3f",
        },
        aqua: {
          DEFAULT: "#7eb8b3",
          dim: "#3d6a67",
        },
        rust: {
          DEFAULT: "#c45c4a",
          dim: "#7a3429",
        },
        slate: {
          DEFAULT: "#8a9bb5",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(201, 163, 106, 0.12)",
        aqua: "0 0 32px rgba(126, 184, 179, 0.16)",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
