"use client";

import { useCallback, useEffect, useState } from "react";

export type Consent = {
	necessary: boolean;
	analytics: boolean;
	marketing: boolean;
};

const CONSENT_KEY = "site_consent_v1";

function readConsent(): Consent | null {
	if (typeof window === "undefined") return null;

	try {
		const raw = localStorage.getItem(CONSENT_KEY);

		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

function writeConsent(consent: Consent) {
	if (typeof window === "undefined") return;

	localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

export function useConsent() {
	const [consent, setConsentState] = useState<Consent | null>(null);
	const [isLoaded, setLoaded] = useState(false);

	useEffect(() => {
		const stored = readConsent();

		setConsentState(stored);
		setLoaded(true);
	}, []);

	const setConsent = useCallback((value: Consent) => {
		writeConsent(value);
		setConsentState(value);
	}, []);

	const acceptAll = useCallback(() => {
		const value: Consent = {
			necessary: true,
			analytics: true,
			marketing: true,
		};

		setConsent(value);
	}, [setConsent]);

	const rejectAll = useCallback(() => {
		const value: Consent = {
			necessary: true,
			analytics: false,
			marketing: false,
		};

		setConsent(value);
	}, [setConsent]);

	return {
		consent,
		isLoaded,
		setConsent,
		acceptAll,
		rejectAll,
		hasConsent: Boolean(consent),
	};
}
