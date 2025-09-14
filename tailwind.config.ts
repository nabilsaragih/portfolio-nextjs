import type { Config } from 'tailwindcss'

// Tailwind v4: use class-based dark mode and scan src/* files
export default {
  darkMode: 'class',
  // Ensure all source files are scanned so dark: classes are generated
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
