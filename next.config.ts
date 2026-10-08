import type { NextConfig } from 'next'

const config: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	output: 'standalone',
	trailingSlash: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			}
		],
		dangerouslyAllowSVG: false
	},
	typedRoutes: false,
	experimental: {
		optimizePackageImports: ['tailwindcss'],
		serverActions: {
			bodySizeLimit: '2mb'
		},
		mdxRs: false
	},
	compress: true,
	async redirects() {
		return [
			{
				source: '/auth/telegram-oauth-finish',
				destination: '/auth/login',
				permanent: false
			},
			{
				source: '/auth/callback',
				destination: '/auth/login',
				permanent: false
			},
			{
				source: '/auth/verify/:token',
				destination: '/auth/register',
				permanent: false
			}
		]
	}
}

export default config
