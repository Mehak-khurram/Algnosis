/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'medical-blue': '#1e3a8a',
                'medical-magenta': '#be185d',
            }
        },
    },
    plugins: [],
} 