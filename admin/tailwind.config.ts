import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0b192c",
        },
        sidebar: {
          DEFAULT: "#08172c",
          dark: "#050f1d",
          hover: "#0f2442",
          active: "#0062e3",
          border: "#122a4d",
          text: "#94a3b8",
        },
        brand: {
          DEFAULT: "#0062E3",
          hover: "#0052C2",
          dark: "#003D99",
          light: "#3B82F6",
          accent: "#EF4444",
        }
      },
    },
  },
  plugins: [],
};

export default config;
