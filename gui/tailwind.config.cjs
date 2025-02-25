/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
<<<<<<< HEAD
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        },
        wrapped: {
          '0%': { transform: 'rotate(-2deg)' },
          '25%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(2deg)' },
          '75%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-2deg)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        wrapped: 'wrapped 2s ease-in-out infinite'
      },
      colors: {
        "vsc-background": "rgb(var(--vsc-background) / <alpha-value>)",
        "secondary-dark": "rgb(var(--secondary-dark) / <alpha-value>)",
      },
      colors: {
        progress: {
          background: "var(--input-background)", // background of the progress bar
          foreground: "var(--button-background)", // the actual progress indicator
        },    
        background: "var(--background)",
        foreground: "var(--foreground)",
        button: {
          DEFAULT: "var(--button-background)",
          foreground: "var(--button-foreground)",
          hover: "var(--button-hover-background)",
        },
        input: {
          DEFAULT: "var(--input-background)",
          foreground: "var(--input-foreground)",
          border: "var(--input-border)",
        },
        dropdown: {
          DEFAULT: "var(--dropdown-background)",
          foreground: "var(--dropdown-foreground)",
        },
        list: {
          activeSelection: {
            background: "var(--list-active-selection-background)",
            foreground: "var(--list-active-selection-foreground)",
          },
          hoverBackground: "var(--list-hover-background)",
        },
        sidebar: {
          background: "var(--sidebar-background)",
        },
        statusbar: {
          background: "var(--statusbar-background)",
          foreground: "var(--statusbar-foreground)",
        },
        tab: {
          activeBackground: "var(--tab-active-background)",
          activeForeground: "var(--tab-active-foreground)",
        },

        /* Tailwind default configs */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
=======
    // Note that these breakpoints are primarily optimized for the input toolbar
    screens: {
      "2xs": "170px", // Smallest width for Primary Sidebar in VS Code
      xs: "250px", // Avg default sidebar width in VS Code
      sm: "330px",
      md: "460px",
      lg: "590px",
      xl: "720px",
      "2xl": "860px",
      "3xl": "1000px",
      "4xl": "1180px",
    },
    extend: {
      animation: {
        "spin-slow": "spin 6s linear infinite",
      },
      colors: {
        lightgray: "#999998",
        "vsc-input-background": "var(--vscode-input-background, rgb(45 45 45))",
        "vsc-background": "var(--vscode-sideBar-background, rgb(30 30 30))",
        "vsc-foreground": "var(--vscode-editor-foreground, #fff)",
        "vsc-editor-background":
          "var(--vscode-editor-background, var(--vscode-sideBar-background, rgb(30 30 30)))",
        "vsc-input-border": "var(--vscode-input-border, #999998)",

        // Starting to make things less vsc-specific
        // TODO make it all non-IDE-specific naming
        "find-match-selected":
          "var(--vscode-editor-findMatchHighlightBackground, rgba(255, 223, 0))",
        "list-active": "var(--vscode-list-activeSelectionBackground, #1bbe84)",
        "list-active-foreground":
          "var(--vscode-quickInputList-focusForeground, var(--vscode-editor-foreground))",
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  corePlugins: {
    preflight: false,
  },
};
