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
                calm: {
                    bg: '#f2f5f1',
                    surface: '#e4ebe2',
                    primary: '#7a9e7a',
                    text: '#2d3a2d',
                },
                fun: {
                    bg: '#fff9f0',
                    surface: '#fcecd7',
                    primary: '#ff6b6b',
                    text: '#4a3728',
                },
                neon: {
                    blue: '#00f3ff',
                    pink: '#ff00ff',
                    purple: '#bc13fe',
                    green: '#39ff14',
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
                'neon-blue': '0 0 5px #00f3ff, 0 0 20px rgba(0, 243, 255, 0.3)',
                'neon-pink': '0 0 5px #ff00ff, 0 0 20px rgba(255, 0, 255, 0.3)',
                'neon-purple': '0 0 10px #bc13fe',
                'calm-soft': '0 4px 14px 0 rgba(122, 158, 122, 0.1)',
                'fun-glow': '0 4px 14px 0 rgba(255, 107, 107, 0.2)',
            }
        },
    },
    plugins: [
        function ({ addVariant }) {
            addVariant('calm', '.calm &')
            addVariant('fun', '.fun &')
        }
    ],
}