// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // This 'content' array tells Tailwind CSS where to look for your utility classes.
  // It needs to scan all your HTML and JavaScript/JSX/TS/TSX files.
  content: [
    "./public/index.html", // Your main HTML file, usually in the 'public' folder
    "./src/**/*.{js,jsx,ts,tsx}", // All JavaScript/JSX/TypeScript/TSX files in the 'src' folder and its subdirectories
    // Add any other paths where you might be using Tailwind classes if they are outside 'src' or 'public'
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here (e.g., add custom colors, fonts, spacing)
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Assuming you want to use the Inter font
      },
      colors: {
        // Example: if you want to define a specific amber shade
        amber: {
          50: '#fffdf5',
          100: '#fff8e1',
          200: '#ffedb3',
          300: '#ffe082',
          400: '#ffd352',
          500: '#ffc107', // Tailwind's default amber-500
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
      },
    },
  },
  plugins: [
    // Add any Tailwind CSS plugins here (e.g., @tailwindcss/forms, @tailwindcss/typography)
  ],
}
