/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-200": "#008f5d", // New Green from screenshot
        "primary-100": "#00b050", // Lighter green
        "secondary-200": "#ffbf00", // Accent yellow
        "secondary-100": "#ffc929",
        "dark-bg": "#f3f4f6",
        "card-bg": "#ffffff",
        "text-primary": "#1f2937",
        "text-secondary": "#6b7280",
        "cream-bg": "#f5f5f5", // Light gray background common in modern apps
        "light-peach": "#ffefd5",
        "light-yellow": "#fff9e6",
        "light-green": "#e8f5e9",
        "purple-badge": "#9c27b0",
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

