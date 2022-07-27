/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
        },
        extend: {},
        fontFamily: {
            mono: ['IBM Plex Mono', 'monospace'],
            sans: ['IBM Plex Sans', 'sans-serif'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
