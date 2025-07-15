import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
	className?: string;
}

export function Layout({ className }: LayoutProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	// Handle responsive sidebar behavior
	useEffect(() => {
		const handleResize = () => {
			// Auto-collapse sidebar on smaller screens
			if (window.innerWidth < 1024) {
				setSidebarCollapsed(true);
			} else {
				setSidebarCollapsed(false);
			}

			// Close mobile sidebar on resize
			setMobileSidebarOpen(false);
		};

		// Set initial state
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Toggle sidebar with Ctrl/Cmd + B
			if ((e.ctrlKey || e.metaKey) && e.key === "b") {
				e.preventDefault();
				setSidebarCollapsed(!sidebarCollapsed);
			}

			// Close mobile sidebar with Escape
			if (e.key === "Escape" && mobileSidebarOpen) {
				setMobileSidebarOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [sidebarCollapsed, mobileSidebarOpen]);

	const handleSidebarToggle = useCallback(() => {
		setSidebarCollapsed(!sidebarCollapsed);
	}, [sidebarCollapsed]);

	const handleMobileSidebarToggle = useCallback(() => {
		setMobileSidebarOpen((prev) => !prev);
	}, []);

	const handleMobileSidebarClose = useCallback(() => {
		setMobileSidebarOpen(false);
	}, []);

	return (
		<div className={cn("min-h-screen bg-background", className)}>
			<div className="flex h-screen overflow-hidden">
				{/* Desktop Sidebar */}
				<Sidebar
					isCollapsed={sidebarCollapsed}
					onToggle={handleSidebarToggle}
				/>

				{/* Mobile Sidebar */}
				<Sidebar
					isMobile
					isOpen={mobileSidebarOpen}
					onClose={handleMobileSidebarClose}
					isCollapsed={false}
					onToggle={() => {}}
				/>

				{/* Main Content Area */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Header */}
					<Header onMenuClick={handleMobileSidebarToggle} />

					{/* Page Content */}
					<main className="flex-1 overflow-y-auto bg-background custom-scrollbar">
						<div className="container mx-auto p-4 lg:p-6 max-w-7xl">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

export { Breadcrumb, usePageTitle } from "./Breadcrumb";
export { Header } from "./Header";
// Export individual components for flexibility
export { Sidebar } from "./Sidebar";
