export const APP = {
	name: "TeaCoder",
	description:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vel alias nam commodi non sapiente.",
	url: "https://teacoder.ru",
	analytics: {
		posthogApiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY ?? "",
		yandexMetrikaId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "",
		fingerprintApiKey: process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY ?? "",
	},
	storage: {
		localStoragePrefix: "tcdr_",
		sessionStoragePrefix: "tcdr_session_",
	},
} as const;
