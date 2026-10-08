/**
 * Course covers are stored as Orion file ids, avatars as full links.
 * `storageUrl` is `features.orion.url` from `GET /`.
 */
export function getMediaSource(
	path: string | null | undefined,
	tag: 'users' | 'courses' | 'attachments',
	storageUrl: string | undefined
) {
	if (!path) {
		return ''
	}

	if (path.startsWith('https://') || !storageUrl) {
		return path
	}

	return `${storageUrl}/${tag}/${path}`
}
