/**
 * Safe browser check
 * @returns true if code runs in browser
 */
export function isBrowser(): boolean {
	return typeof window !== "undefined" && typeof document !== "undefined";
}
