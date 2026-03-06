"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { isBrowser } from "@/lib/utils/isBrowser";
import { APP } from "@/lib/constants/app";

export type Theme = "light" | "dark" | "system";

export interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: "light" | "dark";
	setTheme: (t: Theme) => void;
	toggleTheme: () => void;
	isLoaded: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = `${APP.storage.localStoragePrefix}theme`;

function getStoredTheme(): Theme | null {
	if (!isBrowser()) return null;
	try {
		const value = localStorage.getItem(THEME_KEY);

		return value as Theme | null;
	} catch {
		return null;
	}
}

function setStoredTheme(theme: Theme | null) {
	if (!isBrowser()) return;

	try {
		if (theme === null) localStorage.removeItem(THEME_KEY);
		else localStorage.setItem(THEME_KEY, theme);

		window.dispatchEvent(new StorageEvent("storage", { key: THEME_KEY }));
		window.dispatchEvent(new CustomEvent("app-theme-change", { detail: { theme } }));
	} catch {}
}

function getSystemPrefersDark(): boolean {
	if (!isBrowser()) return false;

	return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function applyTheme(resolved: "light" | "dark") {
	if (!isBrowser()) return;

	const root = document.documentElement;

	if (resolved === "dark") root.classList.add("dark");
	else root.classList.remove("dark");
}

function resolveTheme(theme: Theme): "light" | "dark" {
	if (theme === "system") return getSystemPrefersDark() ? "dark" : "light";

	return theme === "dark" ? "dark" : "light";
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>(() => getStoredTheme() ?? "system");
	const [isLoaded, setIsLoaded] = useState(false);

	const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

	useEffect(() => {
		applyTheme(resolvedTheme);
	}, [resolvedTheme]);

	useEffect(() => {
		if (!isBrowser()) return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");

		function handleChange() {
			if (theme === "system") applyTheme(mq.matches ? "dark" : "light");
		}

		mq.addEventListener?.("change", handleChange);
		mq.addListener?.(handleChange);

		return () => {
			mq.removeEventListener?.("change", handleChange);
			mq.removeListener?.(handleChange);
		};
	}, [theme]);

	useEffect(() => {
		if (!isBrowser()) return;

		function handleStorage(e: StorageEvent) {
			if (e.key !== THEME_KEY) return;

			const newTheme = getStoredTheme() ?? "system";

			setThemeState(newTheme);
		}

		function handleCustom(e: Event) {
			const detail = (e as CustomEvent)?.detail;

			if (!detail) return;

			setThemeState(getStoredTheme() ?? "system");
		}

		window.addEventListener("storage", handleStorage);
		window.addEventListener("app-theme-change", handleCustom);

		return () => {
			window.removeEventListener("storage", handleStorage);
			window.removeEventListener("app-theme-change", handleCustom);
		};
	}, []);

	useEffect(() => setIsLoaded(true), []);

	const setTheme = useCallback((t: Theme) => {
		setStoredTheme(t);
		setThemeState(t);
		applyTheme(resolveTheme(t));
	}, []);

	const toggleTheme = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [theme, setTheme]);

	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, isLoaded }}>
			{children}
		</ThemeContext.Provider>
	);
};
