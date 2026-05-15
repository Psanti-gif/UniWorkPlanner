/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // UI/UX Skill: Productivity Tool palette — Teal focus + action orange
      colors: {
        primary:    { DEFAULT: '#0D9488', dark: '#0F766E', light: '#CCFBF1' },
        accent:     { DEFAULT: '#EA580C', dark: '#C2410C' },
        background: '#F0FDFA',
        foreground: '#134E4A',
        muted:      '#E8F1F4',
        'muted-fg': '#64748B',
        border:     '#99F6E4',
        sidebar:    '#0F2830',
      },
      // UI/UX Skill: Dashboard Data — Fira Code + Fira Sans
      fontFamily: {
        sans: ['"Fira Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-in':  { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-in': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'toast-in': { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
      animation: {
        'fade-in':  'fade-in 0.18s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
        'toast-in': 'toast-in 0.25s ease-out',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        hover: '0 4px 12px rgba(13,148,136,0.15)',
      },
    },
  },
  plugins: [],
}
