/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette - Corporate Navy
        primary: {
          50: '#eef5fc',
          100: '#d7e8f8',
          200: '#b4d3f2',
          300: '#83b6ea',
          400: '#5095e0',
          500: '#2b78d2',
          600: '#043F83', // Exact Primary Navy
          700: '#153c7a',
          800: '#153465',
          900: '#203F60', // Exact Secondary Navy
          950: '#0f2245',
        },
        // Accent palette - Bright Cyan
        accent: {
          50: '#E5F5FA', // Exact Soft Blue
          100: '#d1edf7',
          200: '#a7def1',
          300: '#74cbe9',
          400: '#3fb2df',
          500: '#08A2D6', // Exact Accent Cyan
          600: '#1081b2',
          700: '#136790',
          800: '#145576',
          900: '#164864',
          950: '#0f3045',
        },
        // Neutral grayscale palette
        gray: {
          50: '#F8FAFC', // Exact Background
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#A5B9CD', // Exact Gray Blue
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#2E363D', // Exact Text
          950: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};