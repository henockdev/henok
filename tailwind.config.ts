import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#050816',
          secondary: '#0B1120',
          tertiary: '#0F172A',
        },
        surface: 'rgba(255,255,255,0.04)',
        text: {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        accent: {
          blue: '#38BDF8',
          purple: '#8B5CF6',
          cyan: '#22D3EE',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-satoshi)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 50%, #22D3EE 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.18) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(256, 96%, 67%, 0.15) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.12) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.13) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.10) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.10) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.10) 0px, transparent 50%)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'typing-cursor': 'typing-cursor 1s step-end infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 60px rgba(56, 189, 248, 0.7)' },
        },
        'typing-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
