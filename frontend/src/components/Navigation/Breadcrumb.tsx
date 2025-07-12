import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
	label: string;
	path?: string;
	isActive?: boolean;
}

const routeConfig: Record<string, { label: string; parent?: string }> = {
	"/dashboard": { label: "Dashboard" },
	"/profile": { label: "Profile" },
	"/following": { label: "Following" },
	"/settings": { label: "Settings" },
	"/trip": { label: "Trip Details", parent: "/dashboard" },
	"/login": { label: "Login" },
	"/signup": { label: "Sign Up" },
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
	const breadcrumbs: BreadcrumbItem[] = [];

	// Always start with home/dashboard
	if (pathname !== "/dashboard") {
		breadcrumbs.push({
			label: "Dashboard",
			path: "/dashboard",
		});
	}

	// Handle trip details with dynamic ID
	if (pathname.startsWith("/trip/")) {
		breadcrumbs.push({
			label: "Trip Details",
			isActive: true,
		});
		return breadcrumbs;
	}

	// Handle profile with dynamic ID
	if (pathname.startsWith("/profile/")) {
		breadcrumbs.push({
			label: "Profile",
			isActive: true,
		});
		return breadcrumbs;
	}

	// Handle static routes
	const route = routeConfig[pathname];
	if (route) {
		// Add parent breadcrumbs if they exist
		if (route.parent && route.parent !== "/dashboard") {
			const parentRoute = routeConfig[route.parent];
			if (parentRoute) {
				breadcrumbs.push({
					label: parentRoute.label,
					path: route.parent,
				});
			}
		}

		// Add current route
		if (pathname !== "/dashboard") {
			breadcrumbs.push({
				label: route.label,
				isActive: true,
			});
		}
	}

	// If we're on dashboard and no other breadcrumbs, show just dashboard
	if (pathname === "/dashboard" && breadcrumbs.length === 0) {
		breadcrumbs.push({
			label: "Dashboard",
			isActive: true,
		});
	}

	return breadcrumbs;
}

interface BreadcrumbProps {
	className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
	const location = useLocation();
	const breadcrumbs = generateBreadcrumbs(location.pathname);

	if (breadcrumbs.length === 0) {
		return null;
	}

	return (
		<nav
			className={cn("flex items-center space-x-1 text-sm", className)}
			aria-label="Breadcrumb"
		>
			<ol className="flex items-center space-x-1">
				{/* Home icon for first item if not dashboard */}
				{breadcrumbs[0]?.path && (
					<li className="flex items-center">
						<Link
							to="/dashboard"
							className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
						>
							<Home className="w-4 h-4" />
							<span className="sr-only">Home</span>
						</Link>
						<ChevronRight className="w-4 h-4 text-muted-foreground/50 mx-1" />
					</li>
				)}

				{breadcrumbs.map((item, index) => (
					<li key={`${item.label}-${index}`} className="flex items-center">
						{item.path && !item.isActive ? (
							<Link
								to={item.path}
								className="text-muted-foreground hover:text-foreground transition-colors font-medium"
							>
								{item.label}
							</Link>
						) : (
							<span
								className={cn(
									"font-medium",
									item.isActive ? "text-foreground" : "text-muted-foreground",
								)}
								aria-current={item.isActive ? "page" : undefined}
							>
								{item.label}
							</span>
						)}

						{index < breadcrumbs.length - 1 && (
							<ChevronRight className="w-4 h-4 text-muted-foreground/50 mx-1" />
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}

// Hook for getting current page title
export function usePageTitle() {
	const location = useLocation();
	const breadcrumbs = generateBreadcrumbs(location.pathname);
	return breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";
}
