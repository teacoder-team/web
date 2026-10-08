type EventSource = () => Promise<string | undefined>

const TIMEOUT_MS = 3000

let source: EventSource | null = null

export function setFingerprintSource(next: EventSource | null) {
	source = next
}

/**
 * A fresh Fingerprint event id for `X-Fingerprint-Event`, or `undefined` when the
 * agent is blocked, slow or failing - sign-in must never wait on it.
 */
export async function getFingerprintEvent() {
	if (!source) {
		return undefined
	}

	const timeout = new Promise<undefined>(resolve =>
		setTimeout(() => resolve(undefined), TIMEOUT_MS)
	)

	try {
		return await Promise.race([source(), timeout])
	} catch {
		return undefined
	}
}
