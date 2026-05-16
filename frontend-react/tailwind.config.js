/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Notion-inspired neutral palette + single teal accent
      colors: {
        // Surfaces
        background: '#FAFAF9',      // warm white (page)
        surface:    '#FFFFFF',      // cards
        sidebar:    '#F7F6F3',      // Notion sidebar
        muted:      '#F5F5F4',      // hover/secondary surfaces
        'muted-2':  '#EEEDEA',      // emphasized muted

        // Ink (text)
        foreground: '#1F2937',      // primary text
        'ink-soft': '#52525B',
        'muted-fg': '#71717A',      // secondary text
        'ink-faint':'#A1A1AA',

        // Borders
        border:     '#E7E5E4',
        'border-2': '#D4D4D8',

        // Accent (single, refined teal)
        primary:    { DEFAULT: '#0F766E', dark: '#115E59', soft: '#F0FDFA', ring: 'rgba(15,118,110,0.18)' },
        accent:     { DEFAULT: '#0F766E', dark: '#115E59' },

        // Semantic
        success:    { DEFAULT: '#16A34A', soft: '#F0FDF4' },
        warning:    { DEFAULT: '#D97706', soft: '#FFFBEB' },
        danger:     { DEFAULT: '#DC2626', soft: '#FEF2F2' },
        info:       { DEFAULT: '#2563EB', soft: '#EFF6FF' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        card:    '0 1px 2px rgba(15, 23, 42, 0.04)',
        soft:    '0 2px 6px rgba(15, 23, 42, 0.06)',
        pop:     '0 10px 32px -8px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.06)',
        ring:    '0 0 0 3px rgba(15,118,110,0.16)',
      },
      keyframes: {
        'fade-in':   { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':  { from: { opacity: '0', transform: 'scale(.96)' },      to: { opacity: '1', transform: 'scale(1)' } },
        'slide-in':  { from: { transform: 'translateX(-100%)' },             to: { transform: 'translateX(0)' } },
        'shimmer':   { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        'pulse-soft':{ '0%,100%': { opacity: '1' }, '50%': { opacity: '0.55' } },
      },
      animation: {
        'fade-in':    'fade-in 0.22s ease-out',
        'scale-in':   'scale-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in':   'slide-in 0.25s ease-out',
        'shimmer':    'shimmer 1.4s linear infinite',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
