import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import { Sidebar } from "@/components/Navigation/Sidebar";

const meta = {
	title: "Navigation/Sidebar",
	component: Sidebar,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<BrowserRouter>
				<div style={{ height: "100vh", display: "flex" }}>
					<Story />
					<div style={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5" }}>
						<h2>Main Content Area</h2>
						<p>This is where the main content would be displayed.</p>
					</div>
				</div>
			</BrowserRouter>
		),
	],
	argTypes: {
		onClose: { action: "sidebar closed" },
	},
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isOpen: true,
		onClose: () => {},
	},
};

export const Closed: Story = {
	args: {
		isOpen: false,
		onClose: () => {},
	},
};

export const WithCustomClass: Story = {
	args: {
		isOpen: true,
		onClose: () => {},
		className: "border-r-4 border-blue-500",
	},
};
