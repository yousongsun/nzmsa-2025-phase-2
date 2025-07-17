import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Breadcrumb } from "@/components/Navigation/Breadcrumb";

const meta = {
	title: "Navigation/Breadcrumb",
	component: Breadcrumb,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<MemoryRouter>
			<Breadcrumb />
		</MemoryRouter>
	),
};

export const InLayout: Story = {
	render: () => (
		<MemoryRouter>
			<div className="w-full max-w-4xl p-4 border rounded-lg">
				<Breadcrumb />
				<div className="mt-4 p-4 bg-muted rounded">
					<p>
						Page content would go here. The breadcrumb shows the current
						navigation path.
					</p>
				</div>
			</div>
		</MemoryRouter>
	),
	parameters: {
		layout: "padded",
	},
};
