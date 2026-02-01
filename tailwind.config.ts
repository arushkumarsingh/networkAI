import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f19",
        fog: "#f5f6f8",
        accent: "#ff7a18",
        sky: "#9ad7ff",
        mint: "#8df0c8"
      }
    }
  },
  plugins: []
};

export default config;
