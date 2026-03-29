import type { NextConfig } from 'next'

import { APP } from '@/lib/constants/app'

const config: NextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${APP.api.base}/:path*`
			}
		]
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'DENY'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					},
					{
						key: 'Permissions-Policy',
						value: 'geolocation=(), camera=()'
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload'
					}
				]
			}
		]
	}
}

export default config
