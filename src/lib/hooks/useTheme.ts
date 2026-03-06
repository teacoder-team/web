import { ThemeContext, type ThemeContextValue } from "@/providers/ThemeProvider";
import { useContext } from "react";

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);

	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");

	return ctx;
}
