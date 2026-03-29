import type { MetadataRoute } from 'next'

import { APP } from '@/lib/constants/app'

export default function manifest(): MetadataRoute.Manifest {
	return {
		id: APP.url,
		name: APP.name,
		short_name: APP.name,
		description: APP.description,
		start_url: '/',
		scope: '/',
		display: 'standalone',
		background_color: '#FFFFFF',
		theme_color: '#2563EB',
		orientation: 'portrait',
		lang: 'ru',
		categories: [
			'веб-разработка',
			'курсы по программированию',
			'онлайн-курсы веб-разработки',
			'программирование для начинающих',
			'веб-технологии',
			'фронтенд разработка',
			'бэкенд разработка',
			'создание сайтов',
			'education',
			'web development',
			'programming courses',
			'web development online courses',
			'programming for beginners',
			'web technologies',
			'frontend development',
			'backend development',
			'website creation'
		],
		icons: [
			{
				src: '/icons/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		],
		prefer_related_applications: false
	}
}
