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
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },
                secondary: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
                background: {
                    DEFAULT: '#f8fafc',
                    darker: '#f1f5f9',
                },
                surface: {
                    DEFAULT: '#ffffff',
                    glass: 'rgba(255, 255, 255, 0.7)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.02)',
                'premium-hover': '0 10px 40px -4px rgba(0, 0, 0, 0.08), 0 4px 20px -4px rgba(0, 0, 0, 0.03)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            backdropBlur: {
                'xs': '2px',
            },
        },
    },
    plugins: [],
}
