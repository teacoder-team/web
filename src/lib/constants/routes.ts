export const ROUTES = {
	home: "/",

	about: "/about",
	pricing: "/pricing",

	auth: {
		login: "/auth/login",
		register: "/auth/register",
		forgotPassword: "/auth/forgot-password",
		resetPassword: "/auth/reset-password",
	},
	account: {
		root: "/account",
		settings: "/account/settings",
		sessions: "/account/sessions",
		connections: "/account/connections",
	},
	courses: {
		root: "/courses",
		course: (slug: string) => `/courses/${slug}`,
		lesson: (slug: string) => `/lesson/${slug}`,
	},
	documents: {
		privacy: "/documents/privacy-policy",
		terms: "/documents/terms-of-use",
		cookies: "/documents/cookies",
	},
} as const;

export const PROTECTED_ROUTES = [
	ROUTES.account.root,
	ROUTES.account.settings,
	ROUTES.account.sessions,
	ROUTES.account.connections,
	ROUTES.courses.lesson,
];
