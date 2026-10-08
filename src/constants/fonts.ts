import localFont from 'next/font/local'

export const geist = localFont({
	src: [
		{
			path: '../assets/fonts/Geist/Geist-Thin.ttf',
			weight: '100',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-ExtraLight.ttf',
			weight: '200',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-Light.ttf',
			weight: '300',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-Medium.ttf',
			weight: '500',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-SemiBold.ttf',
			weight: '600',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-Bold.ttf',
			weight: '700',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-ExtraBold.ttf',
			weight: '800',
			style: 'normal'
		},
		{
			path: '../assets/fonts/Geist/Geist-Black.ttf',
			weight: '900',
			style: 'normal'
		}
	],
	variable: '--font-geist-sans',
	display: 'swap'
})
