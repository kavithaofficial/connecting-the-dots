import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#627d98",
          500: "#486581",
          600: "#334e68",
          700: "#243b53",
          800: "#102a43",
          900: "#0b1d33",
          950: "#06101e",
        },
        gold: {
          50: "#fdf8e8",
          100: "#faefc5",
          200: "#f5dd8d",
          300: "#f0cb55",
          400: "#e9b925",
          500: "#d49e0a",
          600: "#b27c06",
          700: "#8c5b05",
          800: "#663e05",
          900: "#422604",
        },
        neutral: {
          warm: "#FBF9F5",
          card: "#FFFFFF",
          muted: "#F3F4F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
