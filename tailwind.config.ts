import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#152032",
        muted: "#687386",
        surface: "#f5f7fb",
        panel: "#ffffff",
        teal: {
          50: "#e7f8f5",
          100: "#c9eee9",
          600: "#0f766e",
          700: "#0b5f59"
        },
        amber: {
          100: "#fff0cc",
          600: "#b7791f"
        },
        danger: "#b42318"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(25, 35, 52, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
