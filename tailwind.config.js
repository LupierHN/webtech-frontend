/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      width: {
        '112': '28rem'
      },
      maxWidth:{
        '2/3': '66.666667%'
      }
    },
  },
  plugins: [
    'flowbite/plugin'
  ]
}

