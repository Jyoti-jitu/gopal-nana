/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F172A",
          navyDark: "#0B1120",
          navyLight: "#1E293B",
          slate: "#334155",
          red: "#D90429",
          redHover: "#B90322",
          redLight: "#FFF1F2",
          copper: "#C87D55",
          grayLight: "#F8FAFC",
          grayBorder: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.08)",
        cardHover: "0 12px 30px -4px rgba(15, 23, 42, 0.15)",
        header: "0 2px 10px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
