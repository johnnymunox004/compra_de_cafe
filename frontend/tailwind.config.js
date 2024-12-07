/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#FFFBEB',
          200: '#FEF3C7',
          900: '#78350F',
        },
      },
      keyframes: {
        slideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translate(0, 100px)',
            filter: 'blur(33px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translate(0)',
            filter: 'blur(0)'
          }
        }
      },
      animation: {
        'slide-in': 'slideIn 1s ease-in-out forwards'
      }
    }
  },
  plugins: [
    require('flowbite/plugin'),
  ],
  safelist: [
    'hover:text-yellow-300', 
    'hover:bg-gray-100',
    'hover:bg-blue-600',
    'hover:text-gray-300',
    'hover:shadow-lg',
    'hover:shadow-gray-900/20',
  ],
};
