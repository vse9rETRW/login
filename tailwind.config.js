module.exports = {
	purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	important: true,
	theme: {
		screens: {
			'2xl': { max: '1536px' },
			xl: { max: '1280px' },
			lg: { max: '1024px' },
			md: { max: '768px' },
			sm: { max: '640px' },
			xs: { max: '425px' },
		},
		extend: {
			colors: {
				default: '#000000d9',
				success: '#52c41a',
				primary: '#1890ff',
				warning: '#faad14',
				danger: '#ff4d4f',
				secondary: '#00000073',
				disabled: '#00000040',
			},
			borderWidth: {
				1: '1px',
			},
			maxWidth: {
				'side-menu': '256px',
				// 'screen-2xl': '1536px',
				// 'screen-xl': '1280px',
				// 'screen-lg': '1024px',
				'screen-md': '768px',
				// 'screen-sm': '640px',
				// 'screen-xs': '425px',
			},
			animation: {
				'fade-side-in-quick': 'fade-side-in .4s ease forwards',
			},
			keyframes: {
				'fade-side-in': {
					'0%': { opacity: 0, transform: `translateY(-4px)` },
					'100%': { opacity: 1, transform: `translateY(0px)` },
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
