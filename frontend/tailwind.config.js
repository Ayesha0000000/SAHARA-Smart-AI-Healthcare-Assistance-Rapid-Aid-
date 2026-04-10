export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#e8f5ee', 100:'#c8e6d8', 400:'#12a87d', 500:'#0a7c5c', 600:'#065c43', 700:'#044330' },
        accent:  { 400:'#22d3ee', 500:'#06b6d4' },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans','sans-serif'],
        display: ['Sora','sans-serif'],
      },
    },
  },
  plugins: [],
}
