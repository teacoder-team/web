export const CONSENT_COOKIE = 'tc_consent'

const MAX_AGE = 60 * 60 * 24 * 365

const VERSION = 'v1'

export interface CookieConsent {
	analytics: boolean
}

export function parseConsent(value: string | undefined): CookieConsent | null {
	const match = value?.match(new RegExp(`^${VERSION}\.a([01])$`))

	return match ? { analytics: match[1] === '1' } : null
}

export function saveConsent(consent: CookieConsent) {
	const value = `${VERSION}.a${consent.analytics ? 1 : 0}`
	const secure = location.protocol === 'https:' ? '; Secure' : ''

	document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`
}
