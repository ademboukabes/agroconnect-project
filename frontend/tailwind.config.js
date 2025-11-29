/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#059669', // Emerald 600
                    light: '#34D399',   // Emerald 400
                    dark: '#047857',    // Emerald 700
                },
                secondary: {
                    DEFAULT: '#0D9488', // Teal 600
                    light: '#2DD4BF',   // Teal 400
                    dark: '#0F766E',    // Teal 700
                },
                accent: {
                    DEFAULT: '#F59E0B', // Amber 500
                    light: '#FBBF24',   // Amber 400
                    dark: '#D97706',    // Amber 600
                },
                surface: '#FFFFFF',
                background: '#F3F4F6', // Cool Gray 100
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
