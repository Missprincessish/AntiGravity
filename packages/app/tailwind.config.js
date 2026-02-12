/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "../ui/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ocean: {
                    bg: '#e9f8f6',
                    surface: '#d8f0eb',
                    primary: '#2aa79b',
                    text: '#123b42',
                },
                sunset: {
                    bg: '#fff1e8',
                    surface: '#ffd9c5',
                    primary: '#ff5f3d',
                    accent: '#ff9a3d',
                    text: '#4d1f1b',
                },
                neon: {
                    teal: '#14f1d9',
                    pink: '#ff00ff',
                    purple: '#bc13fe',
                    green: '#39ff14',
                    blue: '#00b7ff',
                },
                brand: {
                    50: '#f5f7ff',
                    100: '#ebf0fe',
                    200: '#ced9fd',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    900: '#312e81',
                },
                surface: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    900: '#0f172a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'neon-blue': '0 0 5px #00b7ff, 0 0 20px rgba(0, 183, 255, 0.3)',
                'neon-pink': '0 0 5px #ff00ff, 0 0 20px rgba(255, 0, 255, 0.3)',
                'neon-purple': '0 0 10px #bc13fe',
                'ocean-soft': '0 4px 14px 0 rgba(42, 167, 155, 0.22)',
                'sunset-glow': '0 4px 14px 0 rgba(255, 95, 61, 0.28)',
            }
        },
    },
    plugins: [
        function ({ addVariant }) {
            addVariant('ocean', '.ocean &')
            addVariant('sunset', '.sunset &')
        }
    ],
}