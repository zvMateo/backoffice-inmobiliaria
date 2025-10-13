import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Breakpoints personalizados para mejor responsive
        xs: "475px", // Móviles grandes
        sm: "640px", // Tablets
        md: "768px", // Tablets grandes / Laptops pequeñas
        notebook: "1024px", // Notebooks (1366x768 cubre esto)
        lg: "1024px", // Desktop pequeño
        xl: "1280px", // Desktop estándar
        "2xl": "1536px", // Desktop grande
        // Breakpoints para alturas específicas
        "h-sm": { raw: "(min-height: 640px)" },
        "h-md": { raw: "(min-height: 768px)" },
        "h-lg": { raw: "(min-height: 1024px)" },
      },
      spacing: {
        // Espaciado adicional para mejor control
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      fontSize: {
        // Tamaños de fuente optimizados para diferentes pantallas
        xxs: ["0.625rem", { lineHeight: "0.75rem" }],
      },
      minWidth: {
        "0": "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
    },
  },
  plugins: [],
};

export default config;
