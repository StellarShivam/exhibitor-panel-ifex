/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary colors */
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',

        /* Status colors */
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',

        /* Surface colors */
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',

        /* Border colors */
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',

        /* Text colors */
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-light': 'var(--color-text-light)',

        /* Badge colors */
        'badge-error': {
          bg: 'var(--color-badge-error-bg)',
          text: 'var(--color-badge-error-text)',
        },
        'badge-success': {
          bg: 'var(--color-badge-success-bg)',
          text: 'var(--color-badge-success-text)',
        },
        'badge-info': {
          bg: 'var(--color-badge-info-bg)',
          text: 'var(--color-badge-info-text)',
        },

        /* Accent colors */
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
      },
    },
  },
  plugins: [],
};
