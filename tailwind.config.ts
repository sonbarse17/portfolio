import type { Config } from 'tailwindcss'

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  // content/ is scanned because diagram heights are class names stored in the project data.
  content: ['./src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}', './src/content/**/*.ts'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        panel: token('panel'),
        ink: token('ink'),
        muted: token('muted'),
        rule: token('rule'),
        signal: token('signal'),
        accent: 'var(--accent)',
        ok: token('ok'),
        warn: token('warn'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
