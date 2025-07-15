import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
	const { theme, setTheme, actualTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className="flex items-center gap-2 cursor-pointer"
				>
					<Sun className="h-4 w-4" />
					<span>Light</span>
					{theme === "light" && (
						<div className="ml-auto h-2 w-2 rounded-full bg-primary" />
					)}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className="flex items-center gap-2 cursor-pointer"
				>
					<Moon className="h-4 w-4" />
					<span>Dark</span>
					{theme === "dark" && (
						<div className="ml-auto h-2 w-2 rounded-full bg-primary" />
					)}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className="flex items-center gap-2 cursor-pointer"
				>
					<Monitor className="h-4 w-4" />
					<span>System</span>
					{theme === "system" && (
						<div className="ml-auto h-2 w-2 rounded-full bg-primary" />
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
