import type { MetadataRoute } from 'next'

import { env } from '@/lib/config/env'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/*?',
				'/*.html',
				'/auth/recovery/*',
				'/account/*',
				'/lesson/*',
				'*?*=*',
				'*?*=*&*=*',
				'*?*=*=*'
			]
		},
		host: env.APP_URL,
		sitemap: `${env.APP_URL}/sitemap.xml`
	}
}
