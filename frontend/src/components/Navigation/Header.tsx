import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { logout } from "@/redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { Breadcrumb, usePageTitle } from "./Breadcrumb";

interface HeaderProps {
	onMenuClick: () => void;
	className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const pageTitle = usePageTitle();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);

	// Get user info from Redux store
	const { isLoggedIn } = useSelector((state: RootState) => state.auth);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	const notifications = [
		{
			id: 1,
			title: "New follower",
			message: "John started following you",
			time: "2 min ago",
			unread: true,
		},
		{
			id: 2,
			title: "Trip shared",
			message: "Sarah shared a trip with you",
			time: "1 hour ago",
			unread: true,
		},
		{
			id: 3,
			title: "Welcome!",
			message: "Complete your profile to get started",
			time: "1 day ago",
			unread: false,
		},
	];

	const unreadCount = notifications.filter((n) => n.unread).length;

	if (!isLoggedIn) {
		return null;
	}

	return (
		<header
			className={cn(
				"sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/95 nav-blur px-4 lg:px-6",
				className,
			)}
		>
			{/* Mobile Menu Button */}
			<Button
				variant="ghost"
				size="icon"
				className="md:hidden"
				onClick={onMenuClick}
			>
				<Menu className="w-5 h-5" />
				<span className="sr-only">Toggle menu</span>
			</Button>

			{/* Page Title & Breadcrumbs */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<h1 className="text-lg font-semibold text-foreground truncate">
						{pageTitle}
					</h1>
				</div>
				<Breadcrumb className="hidden sm:flex" />
			</div>

			{/* Search Bar */}
			{/* <div className="hidden md:flex relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search trips, users..."
					className="pl-10 pr-4 py-2 w-64 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
				/>
			</div> */}

			{/* Action Buttons */}
			<div className="flex items-center gap-2">
				{/* Create Trip Button */}
				{/* <Button
					size="sm"
					className="hidden sm:flex gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
					onClick={() => {
						// Find and click the create trip button in the dashboard
						const createTripButton = document.querySelector(
							"[data-create-trip-trigger]",
						) as HTMLButtonElement;
						if (createTripButton) {
							createTripButton.click();
						}
					}}
				>
					<Plus className="w-4 h-4" />
					<span className="hidden lg:inline">New Trip</span>
				</Button> */}

				{/* Mobile Search */}
				{/* <Button variant="ghost" size="icon" className="md:hidden">
					<Search className="w-4 h-4" />
					<span className="sr-only">Search</span>
				</Button> */}

				{/* Theme Toggle */}
				<ThemeToggle />

				{/* Notifications */}
				<div className="relative">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setShowNotifications(!showNotifications)}
						className="relative"
					>
						<Bell className="w-4 h-4" />
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
								{unreadCount}
							</span>
						)}
						<span className="sr-only">Notifications</span>
					</Button>

					{/* Notifications Dropdown */}
					{showNotifications && (
						<div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
							<div className="p-4 border-b border-border">
								<h3 className="font-semibold text-sm">Notifications</h3>
							</div>
							<div className="max-h-64 overflow-y-auto">
								{notifications.map((notification) => (
									<div
										key={notification.id}
										className={cn(
											"p-3 border-b border-border last:border-b-0 hover:bg-accent/50 cursor-pointer",
											notification.unread && "bg-primary/5",
										)}
									>
										<div className="flex items-start gap-3">
											<div
												className={cn(
													"w-2 h-2 rounded-full mt-2",
													notification.unread
														? "bg-blue-500"
														: "bg-transparent",
												)}
											/>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground">
													{notification.title}
												</p>
												<p className="text-sm text-muted-foreground truncate">
													{notification.message}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													{notification.time}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="p-3 border-t border-border">
								<Button variant="ghost" size="sm" className="w-full">
									View all notifications
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* User Menu */}
				<div className="relative">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setShowUserMenu(!showUserMenu)}
						className="rounded-full"
					>
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
							<User className="w-4 h-4 text-white" />
						</div>
						<span className="sr-only">User menu</span>
					</Button>

					{/* User Menu Dropdown */}
					{showUserMenu && (
						<div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
							<div className="p-4 border-b border-border">
								<p className="text-sm font-medium text-foreground">Welcome!</p>
								{/* <p className="text-xs text-muted-foreground">
									user@example.com
								</p> */}
							</div>

							<div className="py-2">
								<Link
									to="/profile"
									className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors"
									onClick={() => setShowUserMenu(false)}
								>
									<User className="w-4 h-4" />
									View Profile
								</Link>

								<Link
									to="/settings"
									className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors"
									onClick={() => setShowUserMenu(false)}
								>
									<Settings className="w-4 h-4" />
									Settings
								</Link>

								<div className="border-t border-border my-2" />

								<button
									type="button"
									onClick={handleLogout}
									className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
								>
									<LogOut className="w-4 h-4" />
									Sign Out
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Click outside handler for dropdowns */}
			{(showUserMenu || showNotifications) && (
				<button
					type="button"
					className="fixed inset-0 z-40 cursor-default"
					onClick={() => {
						setShowUserMenu(false);
						setShowNotifications(false);
					}}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setShowUserMenu(false);
							setShowNotifications(false);
						}
					}}
					aria-label="Close menu"
				/>
			)}
		</header>
	);
}
