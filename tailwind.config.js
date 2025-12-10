/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1e40af",
        },
        secondary: {
          DEFAULT: "#f59e42",
          light: "#fbbf24",
          dark: "#b45309",
        },
        accent: "#10b981",
        background: "#f8fafc",
        surface: "#ffffff",
        muted: "#64748b",
        border: "#e5e7eb",
        error: "#ef4444",
        success: "#22c55e",
        warning: "#facc15",
        info: "#0ea5e9",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
        md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
        inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
        none: "none",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.5rem",
        md: "0.375rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["Fira Mono", "ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [],
};
