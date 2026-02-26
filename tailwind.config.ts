import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        avenir: ['"Avenir"', '"Century Gothic"', "sans-serif"],
      },
      fontSize: {
        "display-sm": ["1.875rem", { lineHeight: "2.375rem" }],
        "display-xs": ["1.5rem", { lineHeight: "2rem" }],
        "text-xl": ["1.25rem", { lineHeight: "1.875rem" }],
        "text-lg": ["1.0625rem", { lineHeight: "1.75rem" }],
        "text-md": ["0.9375rem", { lineHeight: "1.5rem" }],
        "text-sm": ["0.8125rem", { lineHeight: "1.25rem" }],
        "text-xs": ["0.75rem", { lineHeight: "1.125rem" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        brand: {
          900: "hsl(var(--brand-900))",
          800: "hsl(var(--brand-800))",
          700: "hsl(var(--brand-700))",
          600: "hsl(var(--brand-600))",
          500: "hsl(var(--brand-500))",
          400: "hsl(var(--brand-400))",
          300: "hsl(var(--brand-300))",
          200: "hsl(var(--brand-200))",
          100: "hsl(var(--brand-100))",
        },
        gray: {
          900: "hsl(var(--gray-900))",
          800: "hsl(var(--gray-800))",
          700: "hsl(var(--gray-700))",
          600: "hsl(var(--gray-600))",
          500: "hsl(var(--gray-500))",
          400: "hsl(var(--gray-400))",
          300: "hsl(var(--gray-300))",
          200: "hsl(var(--gray-200))",
          100: "hsl(var(--gray-100))",
        },
        error: {
          900: "hsl(var(--error-900))",
          600: "hsl(var(--error-600))",
          400: "hsl(var(--error-400))",
          100: "hsl(var(--error-100))",
        },
        warning: {
          800: "hsl(var(--warning-800))",
          400: "hsl(var(--warning-400))",
          100: "hsl(var(--warning-100))",
        },
        success: {
          900: "hsl(var(--success-900))",
          800: "hsl(var(--success-800))",
          400: "hsl(var(--success-400))",
          100: "hsl(var(--success-100))",
        },
      },
      spacing: {
        "ram-xxs": "2px",
        "ram-sm": "6px",
        "ram-md": "8px",
        "ram-lg": "12px",
        "ram-xl": "16px",
        "ram-2xl": "20px",
        "ram-3xl": "24px",
        "ram-4xl": "32px",
        "ram-6xl": "48px",
        "ram-7xl": "64px",
      },
      borderRadius: {
        "ram-xs": "4px",
        "ram-md": "8px",
        "ram-xl": "12px",
        "ram-3xl": "20px",
        "ram-4xl": "24px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "ram-sm":
          "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
        "ram-lg":
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "hsl(200 100% 40% / 0.4)" },
          "50%": { borderColor: "hsl(200 100% 40% / 1)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-border": "pulse-border 2s ease-in-out infinite",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
