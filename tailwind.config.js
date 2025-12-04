/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "discover-background":
          "linear-gradient(0deg, rgba(147, 129, 255, 0) 27.62%, rgba(147, 129, 255, 0.18) 100%)",
      },
      fontFamily: {
        outfit: [
          "Outfit",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        questrial: [
          "Questrial",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        pressStart: [
          "'Press Start 2P'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        slideIn: "slideIn 0.3s forwards",
        spin: "spin 8s linear infinite",
      },
      keyframes: {
        slideIn: {
          "0%": {
            opacity: "0",
            transform: "scaleX(0)",
          },
          "100%": {
            opacity: "1",
            transform: "scaleX(1)",
          },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        input: "var(--input)",
        "input-placeholder": "var(--input-placeholder)",
        "app-icon-border": "var(--app-icon-border)",
        "pill-border": "var(--pill-border)",
        "gray-border": "var(--gray-border)",
        "modal-background": "var(--modal-background)",
        danger: "var(--danger)",
        "lime-primary": "var(--lime-primary)",
        "lime-green": "var(--lime-green)",
        "dark-gray": "var(--dark-gray)",
        "avatar-background": "var(--avatar-background)",
      },
      inset: {
        telegramHeader:
          "calc(var(--tg-content-safe-area-inset-top) + var(--tg-safe-area-inset-top) + var(--tg-safe-area-custom-top) + 14px)",
      },
      padding: {
        telegramHeader:
          "calc(var(--tg-content-safe-area-inset-top) + var(--tg-safe-area-inset-top))",
      },
    },
  },
  plugins: [
    ({ addComponents }) => {
      addComponents({
        ".votigram-grid": {
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          columnGap: "0.375rem",
          margin: "0 auto",
          width: "100%",
          maxWidth: "1120px",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 1.25rem",
          "@screen md": {
            padding: "0 2.5rem",
          },
          "@screen lg": {
            padding: "0 3.75rem",
            gap: "1.25rem",
          },
          "@screen xl": {
            padding: "0",
          },
        },
        ...Array.from({ length: 12 }, (_, i) => i + 1).reduce((acc, col) => {
          acc[`.col-${col}`] = {
            gridColumn: `span ${col} / span ${col}`,
          };
          acc[`.offset-${col}`] = {
            gridColumnStart: `${col + 1} !important`,
          };
          return acc;
        }, {}),
      });
    },
  ],
};
