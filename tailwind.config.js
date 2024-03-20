/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      columns: {
        '4xs': '6rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

