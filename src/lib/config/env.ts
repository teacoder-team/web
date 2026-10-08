export const env = {
	NODE_ENV: process.env.NODE_ENV || 'production',

	APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://teacoder.ru',
	API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.teacoder.ru',

	SUPPORT_EMAIL:
		process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@teacoder.ru',
	OWNER_NAME: process.env.NEXT_PUBLIC_OWNER_NAME,
	OWNER_INN: process.env.NEXT_PUBLIC_OWNER_INN,

	FPJS_API_KEY: process.env.NEXT_PUBLIC_FPJS_API_KEY,
	FPJS_ENDPOINT: process.env.NEXT_PUBLIC_FPJS_ENDPOINT,
	YANDEX_METRIKA_ID: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
} as const
