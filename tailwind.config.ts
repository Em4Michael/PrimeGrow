import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '8xl': '0 35px 60px 15px rgba(0, 0, 0, 0.9)',
        '4xl': '0 35px 60px 15px rgba(0, 0, 0, 0.4)',
      },
      colors: {
        gold: {
          600: "#ffd700",
        },
        primary: {
          100: "rgb(255,231,185)",
          200: "hsla(0, 0%, 57%, 1)",
          400: "hsla(246, 29%, 33%, 1)",
          600: "hsla(246, 74%, 15%, 1)",
          50: "hsla(240, 14%, 92%, 1)",
        },
        gray: {
          200: "hsla(204, 11%, 75%, 1)",
          300: "hsla(0, 0%, 38%, 1)",
          400: "hsla(240, 1%, 38%, 1)",
        },
        black: {
          100: "hsla(0, 0%, 0%, 0.75)",
          400: "hsla(0, 0%, 26%, 0.8)",
          600: "hsla(0, 0%, 8%, 1)",
        },
        blue: {
          100: "#cce4f6",
          200: "#99c9ed",
          400: "#3390db",
          600: "#0067c2",
          50: "#e6f2fa",
        },
        red: {
          100: "#f7ccd2",
          200: "#ef99a5",
          400: "#e63946",
          600: "#c4182b",
          50: "#fdeef0",
        },
        green: {
          100: "#ccf5e1",
          200: "#99ebc3",
          400: "#33d67d",
          600: "#00bf4f",
          50: "#e6fbf2",
        },
        purple: {
          100: "#e4ccf7",
          200: "#c999ef",
          400: "#9633db",
          600: "#6c00c2",
          50: "#f2e6fa",
        },
        yellow: {
          100: "#fff9cc",
          200: "#fff399",
          400: "#ffea33",
          600: "#ffd700",
          50: "#fffdf2",
        },
        "pastel-bg": "hsla(240, 100%, 99%, 1)",
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        Sora: ["Sora", "sans-serif"],
        "Work-Sans": ["Work Sans", "sans-serif"],
      },
      height: {
        "screen-16": "calc(100vh - 84px)",
      },
      fontSize: {
        h6: "16px",
        h5: "24px",
        h2: "64px",
      },
    },
    screens: {
      xs: "375px",
      ss: "620px",
      sm: "768px",
      ms: "860px",
      md: "1200px",
      lg: "1300px",
      xl: "1700px",
    },
  },
  plugins: [],
};
export default config;
