import {
	ChevronLeft,
	ChevronRight,
	Home,
	MapPin,
	MessageSquare,
	Settings,
	User,
	Users,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	path: string;
	badge?: string;
}

const navigationItems: NavigationItem[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: Home,
		path: "/dashboard",
	},
	{
		id: "posts",
		label: "Posts",
		icon: MessageSquare,
		path: "/posts",
	},
	{
		id: "profile",
		label: "Profile",
		icon: User,
		path: "/profile",
	},
	{
		id: "following",
		label: "Following",
		icon: Users,
		path: "/following",
	},
	{
		id: "settings",
		label: "Settings",
		icon: Settings,
		path: "/settings",
	},
];

interface SidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
	isMobile?: boolean;
	isOpen?: boolean;
	onClose?: () => void;
}

export function Sidebar({
	isCollapsed,
	onToggle,
	isMobile = false,
	isOpen = false,
	onClose,
}: SidebarProps) {
	const location = useLocation();
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore dependency on location.pathname
	useEffect(() => {
		if (isMobile && onClose) {
			onClose();
		}
	}, [location.pathname, isMobile, onClose]);

	const isActive = (path: string) => {
		if (path === "/dashboard") {
			return (
				location.pathname === "/dashboard" ||
				location.pathname.startsWith("/trip/")
			);
		}
		return location.pathname.startsWith(path);
	};

	const sidebarContent = (
		<>
			{/* Header */}
			<div
				className={cn(
					"flex items-center justify-between p-4 border-b border-border/50",
					isCollapsed && !isMobile && "justify-center",
				)}
			>
				{(!isCollapsed || isMobile) && (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<MapPin className="w-4 h-4 text-white" />
						</div>
						<span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							TripShare
						</span>
					</div>
				)}

				{isMobile ? (
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="md:hidden"
					>
						<X className="w-4 h-4" />
					</Button>
				) : (
					<Button
						variant="ghost"
						size="icon"
						onClick={onToggle}
						className="hidden md:flex"
					>
						{isCollapsed ? (
							<ChevronRight className="w-4 h-4" />
						) : (
							<ChevronLeft className="w-4 h-4" />
						)}
					</Button>
				)}
			</div>

			{/* Navigation Items */}
			<nav className="flex-1 p-2 space-y-1 custom-scrollbar overflow-y-auto">
				{navigationItems.map((item) => {
					const Icon = item.icon;
					const active = isActive(item.path);
					const hovered = hoveredItem === item.id;

					return (
						<Link
							key={item.id}
							to={item.path}
							className={cn(
								"group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
								"hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								active &&
									"bg-primary/10 text-primary border-r-2 border-primary",
								!active && "text-muted-foreground hover:text-foreground",
								isCollapsed && !isMobile && "justify-center px-2",
							)}
							onMouseEnter={() => setHoveredItem(item.id)}
							onMouseLeave={() => setHoveredItem(null)}
						>
							<Icon
								className={cn(
									"w-5 h-5 transition-colors",
									active && "text-primary",
								)}
							/>

							{(!isCollapsed || isMobile) && (
								<>
									<span className="font-medium truncate">{item.label}</span>
									{item.badge && (
										<span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
											{item.badge}
										</span>
									)}
								</>
							)}

							{/* Tooltip for collapsed state */}
							{isCollapsed && !isMobile && (hovered || active) && (
								<div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md border whitespace-nowrap z-50">
									{item.label}
								</div>
							)}

							{/* Active indicator */}
							{active && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
							)}
						</Link>
					);
				})}
			</nav>

			{/* Footer */}
			<div
				className={cn(
					"p-4 border-t border-border/50",
					isCollapsed && !isMobile && "px-2",
				)}
			>
				<div
					className={cn(
						"flex items-center gap-3 p-2 rounded-lg bg-accent/30",
						isCollapsed && !isMobile && "justify-center",
					)}
				>
					<Link
						to="/profile"
						className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center hover:opacity-80 transition"
					>
						<User className="w-4 h-4 text-white" />
					</Link>
					{(!isCollapsed || isMobile) && (
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">Welcome back!</p>
							<p className="text-xs text-muted-foreground truncate">
								Explore & Share
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);

	if (isMobile) {
		return (
			<>
				{/* Mobile Overlay */}
				{isOpen && (
					<button
						type="button"
						className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-default"
						onClick={onClose}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								onClose?.();
							}
						}}
						aria-label="Close sidebar"
					/>
				)}

				{/* Mobile Sidebar */}
				<aside
					className={cn(
						"fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 transform transition-transform duration-300 md:hidden animate-slide-in",
						isOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<div className="flex flex-col h-full">{sidebarContent}</div>
				</aside>
			</>
		);
	}

	// Desktop Sidebar
	return (
		<aside
			className={cn(
				"hidden md:flex flex-col h-full bg-background border-r border-border layout-transition relative",
				isCollapsed ? "w-16" : "w-64",
			)}
		>
			{sidebarContent}
		</aside>
	);
}
