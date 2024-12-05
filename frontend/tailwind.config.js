import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import hlmTailwindPreset from "@spartan-ng/ui-core/hlm-tailwind-preset";


/** @type {import('tailwindcss').Config} */
export default {
    presets: [hlmTailwindPreset],
    content: [
      "./src/**/*.{html,ts}", "./libs/ui/**/*.{html,ts}"
    ],
    theme: {
        extend: {
            /** Undo spartan changes to tailwind containers */
            container: {
                center: true,
                padding: "2rem",
                screens: {
                    sm: "640px",
                    md: "768px",
                    lg: "1024px",
                    xl: "1280px",
                    "2xl": "1536px",
                },
            },
            transitionTimingFunction: {
                "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
                "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
                "in-out-expo": "cubic-bezier(1, 0, 0, 1)",
            },
        },
    },
    plugins: [typography, forms({ strategy: "class" })],  }