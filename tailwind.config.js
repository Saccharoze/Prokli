/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161622', // text on light backgrounds
        lilac: '#D49FFA', // buttons and highlights
        orchid: '#D46AFA', // links
      },
      // family names are the keys given to useFonts() in app/_layout.tsx
      fontFamily: {
        display: ['Fredoka-SemiBold', 'sans-serif'],
        body: ['Poppins-Regular', 'sans-serif'],
        'body-medium': ['Poppins-Medium', 'sans-serif'],
        'body-semibold': ['Poppins-SemiBold', 'sans-serif'],
        'body-bold': ['Poppins-Bold', 'sans-serif'],
        'body-extrabold': ['Poppins-ExtraBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
