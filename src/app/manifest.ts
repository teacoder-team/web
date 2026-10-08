import { MetadataRoute } from 'next'

import { SEO } from '@/constants/seo'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SEO.name,
		short_name: SEO.name,
		categories: SEO.keywords,
		lang: 'ru_RU',
		description: SEO.description,
		start_url: '/',
		display: 'standalone',
		background_color: '#FFFFFF',
		theme_color: '#2563EB',
		orientation: 'portrait',
		icons: [
			{
				src: '/touch-icons/192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/touch-icons/512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		]
	}
}
