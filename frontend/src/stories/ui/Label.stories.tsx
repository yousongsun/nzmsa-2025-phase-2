import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
	title: "UI/Label",
	component: Label,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
		},
	},
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Label",
	},
};

export const WithInput: Story = {
	render: () => (
		<div className="space-y-2">
			<Label htmlFor="username">Username</Label>
			<Input id="username" placeholder="Enter your username" />
		</div>
	),
};

export const Required: Story = {
	render: () => (
		<Label htmlFor="email">
			Email <span className="text-red-500">*</span>
		</Label>
	),
};

export const LongLabel: Story = {
	render: () => (
		<Label htmlFor="description">
			Please provide a detailed description of your requirements and preferences
		</Label>
	),
};

export const WithIcon: Story = {
	render: () => (
		<Label htmlFor="password">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
				<circle cx="12" cy="16" r="1" />
				<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			</svg>
			Password
		</Label>
	),
};
