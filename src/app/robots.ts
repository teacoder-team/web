import type { MetadataRoute } from 'next'

import { APP } from '@/lib/constants/app'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/', '/courses', '/courses/*', '/about', '/premium'],
				disallow: ['/api/', '/account/']
			},
			{
				userAgent: 'Googlebot',
				allow: '/',
				disallow: ['/api/', '/account/']
			}
		],
		host: APP.url,
		sitemap: [`${APP.url}/sitemap.xml`]
	}
}
