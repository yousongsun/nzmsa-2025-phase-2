import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	actualTheme: "dark" | "light"; // The resolved theme (system resolves to dark or light)
};

const ThemeProviderContext = createContext<
	ThemeProviderContextType | undefined
>(undefined);

export function useTheme() {
	const context = useContext(ThemeProviderContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
		}
		return defaultTheme;
	});

	const [actualTheme, setActualTheme] = useState<"dark" | "light">("light");

	useEffect(() => {
		const root = window.document.documentElement;

		// Remove existing theme classes
		root.classList.remove("light", "dark");

		let resolvedTheme: "dark" | "light";

		if (theme === "system") {
			resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		} else {
			resolvedTheme = theme;
		}

		// Add the resolved theme class
		root.classList.add(resolvedTheme);
		setActualTheme(resolvedTheme);
	}, [theme]);

	useEffect(() => {
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (theme === "system") {
				const root = window.document.documentElement;
				root.classList.remove("light", "dark");

				const newTheme = e.matches ? "dark" : "light";
				root.classList.add(newTheme);
				setActualTheme(newTheme);
			}
		};

		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			mediaQuery.addEventListener("change", handleSystemThemeChange);

			return () => {
				mediaQuery.removeEventListener("change", handleSystemThemeChange);
			};
		}
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
		actualTheme,
	};

	return (
		<ThemeProviderContext.Provider value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}
