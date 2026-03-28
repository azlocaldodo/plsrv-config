/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'slate-dark': '#0f172a',
        'slate-card': '#1e293b',
        'slate-border': '#334155',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b981',
        'accent-amber': '#f59e0b',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}