import { env } from '@/lib/config/env'

export const SEO = {
	name: 'TeaCoder',
	description:
		'Курсы по веб-разработке с практикой на реальных примерах: уроки, исходный код проектов и прогресс обучения. Изучай веб-разработку в удобном для себя ритме.',
	url: env.APP_URL,
	keywords: [
		'веб-разработка',
		'курсы по программированию',
		'онлайн-курсы веб-разработки',
		'программирование для начинающих',
		'веб-технологии',
		'фронтенд разработка',
		'бэкенд разработка',
		'создание сайтов',
		'web development',
		'programming courses',
		'web development online courses',
		'programming for beginners',
		'web technologies',
		'frontend development',
		'backend development',
		'website creation'
	]
}

export const OG_IMAGE = {
	url: new URL('/opengraph.jpg', env.APP_URL),
	width: 2400,
	height: 1260,
	alt: 'TeaCoder - образовательная платформа по веб-разработке'
}
