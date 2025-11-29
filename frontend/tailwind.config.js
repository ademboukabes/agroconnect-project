/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10B981', // Emerald 500
                secondary: '#059669', // Emerald 600
                accent: '#F59E0B', // Amber 500
            }
        },
    },
    plugins: [],
}
