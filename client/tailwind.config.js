/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF3131",
          dark: "#D62828",
          light: "#FF5E5E",
        },
        secondary: {
          DEFAULT: "#1a1a1a",
          light: "#2d2d2d",
        },
        accent: {
          DEFAULT: "#FFC107",
          light: "#FFD54F",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        'premium': '24px',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(255, 49, 49, 0.3)',
      }
    },
  },
  plugins: [],
};
