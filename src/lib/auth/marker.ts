export const SESSION_MARKER = 'tc_session'

const MAX_AGE = 60 * 60 * 24 * 30

export function setSessionMarker() {
	const secure = location.protocol === 'https:' ? '; Secure' : ''

	document.cookie = `${SESSION_MARKER}=1; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`
}

export function clearSessionMarker() {
	document.cookie = `${SESSION_MARKER}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function hasSessionMarker() {
	return document.cookie
		.split(';')
		.some(part => part.trim().startsWith(`${SESSION_MARKER}=1`))
}
