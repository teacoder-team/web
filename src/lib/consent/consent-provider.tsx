'use client'

import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState
} from 'react'

import { type CookieConsent, saveConsent } from './consent'

interface ConsentContextValue {
	/** `null` until the visitor has made a choice. */
	consent: CookieConsent | null
	isSettingsOpen: boolean
	save: (consent: CookieConsent) => void
	openSettings: () => void
	closeSettings: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

interface ConsentProviderProps {
	/** Read from the cookie on the server, so returning visitors see no dialog flash. */
	initialConsent: CookieConsent | null
	children: ReactNode
}

export function ConsentProvider({
	initialConsent,
	children
}: ConsentProviderProps) {
	const [consent, setConsent] = useState(initialConsent)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	const save = useCallback(
		(next: CookieConsent) => {
			saveConsent(next)
			setIsSettingsOpen(false)

			// Analytics scripts that already ran cannot be unloaded - start clean.
			if (consent?.analytics && !next.analytics) {
				window.location.reload()
				return
			}

			setConsent(next)
		},
		[consent]
	)

	const openSettings = useCallback(() => setIsSettingsOpen(true), [])
	const closeSettings = useCallback(() => setIsSettingsOpen(false), [])

	const value = useMemo(
		() => ({ consent, isSettingsOpen, save, openSettings, closeSettings }),
		[consent, isSettingsOpen, save, openSettings, closeSettings]
	)

	return (
		<ConsentContext.Provider value={value}>
			{children}
		</ConsentContext.Provider>
	)
}

export function useConsent() {
	const context = useContext(ConsentContext)

	if (!context) {
		throw new Error('useConsent must be used within ConsentProvider')
	}

	return context
}
