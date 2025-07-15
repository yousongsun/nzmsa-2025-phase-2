import { useTheme } from "@/lib/theme";

export function ThemeStatus() {
	const { theme, actualTheme } = useTheme();

	return (
		<div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg text-sm z-50">
			<div className="font-medium">Theme Status</div>
			<div className="text-muted-foreground">
				Theme: <span className="font-mono">{theme}</span>
			</div>
			<div className="text-muted-foreground">
				Actual: <span className="font-mono">{actualTheme}</span>
			</div>
		</div>
	);
}
