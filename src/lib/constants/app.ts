import 'dotenv/config'

export const APP = {
	name: process.env.NEXT_PUBLIC_APP_NAME ?? 'TeaCoder',
	url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://teacoder.ru',
	description:
		'Образовательная платформа для изучения веб-разработки через практику и создание реальных проектов с использованием современных технологий',
	analytics: {
		posthogApiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY ?? '',
		yandexMetrikaId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? '',
		fingerprintApiKey: process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY ?? ''
	},
	storage: {
		localStoragePrefix: process.env.NEXT_PUBLIC_LOCAL_STORAGE_PREFIX ?? 'tcdr_',
		sessionStoragePrefix: process.env.NEXT_PUBLIC_SESSION_STORAGE_PREFIX ?? 'tcdr_session_'
	},
	api: {
		base: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
		media: process.env.NEXT_PUBLIC_API_MEDIA_URL ?? ''
	}
} as const
