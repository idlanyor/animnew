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
        // Instagram-inspired color palette
        instagram: {
          // Light mode colors
          'light-bg': '#FAFAFA',
          'light-surface': '#FFFFFF',
          'light-card': '#FFFFFF',
          'light-text': '#262626',
          'light-text-secondary': '#8E8E8E',
          'light-border': '#DBDBDB',
          'light-accent': '#EFEFEF',
          'light-primary': '#0095F6',
          'light-primary-hover': '#0081D9',
          'light-gradient-start': '#833AB4',
          'light-gradient-middle': '#FD1D1D',
          'light-gradient-end': '#FCB045',
          
          // Dark mode colors
          'dark-bg': '#000000',
          'dark-surface': '#121212',
          'dark-card': '#1A1A1A',
          'dark-text': '#FFFFFF',
          'dark-text-secondary': '#A8A8A8',
          'dark-border': '#2F2F2F',
          'dark-accent': '#262626',
          'dark-primary': '#0095F6',
          'dark-primary-hover': '#0081D9',
          'dark-gradient-start': '#833AB4',
          'dark-gradient-middle': '#FD1D1D',
          'dark-gradient-end': '#FCB045',
        },
        // Shorthand for easier usage
        'ig-primary': {
          light: '#0095F6',
          dark: '#0095F6',
        },
        'ig-bg': {
          light: '#FAFAFA',
          dark: '#000000',
        },
        'ig-surface': {
          light: '#FFFFFF',
          dark: '#121212',
        },
        'ig-card': {
          light: '#FFFFFF',
          dark: '#1A1A1A',
        },
        'ig-text': {
          light: '#262626',
          dark: '#FFFFFF',
        },
        'ig-text-secondary': {
          light: '#8E8E8E',
          dark: '#A8A8A8',
        },
        'ig-border': {
          light: '#DBDBDB',
          dark: '#2F2F2F',
        },
        'ig-accent': {
          light: '#EFEFEF',
          dark: '#262626',
        },
      },
      backgroundImage: {
        'instagram-gradient': 'linear-gradient(45deg, #833AB4, #FD1D1D, #FCB045)',
        'instagram-gradient-radial': 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
      },
      boxShadow: {
        'instagram-light': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'instagram-dark': '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
