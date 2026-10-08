import { env } from '@/lib/config/env'

export const SEO = {
	name: 'TeaCoder',
	description:
		'Образовательная платформа для программистов и IT-специалистов. Здесь вы найдёте качественные курсы по веб-разработке, актуальные новости IT-сферы, полезные статьи и активное сообщество разработчиков.',
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
	],
	formatDetection: {
		email: false,
		address: false,
		telephone: false
	}
}
