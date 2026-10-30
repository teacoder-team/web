import type { MetadataRoute } from 'next'

import { env } from '@/lib/config/env'

/**
 * Private areas are blocked from crawling; `/auth` stays crawlable so the
 * `noindex` on those pages can actually be read.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/account/', '/lesson/', '/payment/', '/*?']
		},
		host: env.APP_URL,
		sitemap: `${env.APP_URL}/sitemap.xml`
	}
}
