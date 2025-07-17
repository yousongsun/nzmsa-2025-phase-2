import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
	title: "UI/Input",
	component: Input,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: { type: "select" },
			options: ["text", "email", "password", "number", "tel", "url", "search"],
		},
		placeholder: {
			control: "text",
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: "Enter text...",
	},
};

export const WithLabel: Story = {
	render: () => (
		<div className="space-y-2">
			<Label htmlFor="email">Email</Label>
			<Input id="email" type="email" placeholder="Enter your email" />
		</div>
	),
};

export const Password: Story = {
	args: {
		type: "password",
		placeholder: "Enter password",
	},
};

export const Email: Story = {
	args: {
		type: "email",
		placeholder: "Enter email address",
	},
};

export const NumberInput: Story = {
	args: {
		type: "number",
		placeholder: "Enter a number",
	},
};

export const Search: Story = {
	args: {
		type: "search",
		placeholder: "Search...",
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "Disabled input",
		disabled: true,
	},
};

export const WithValue: Story = {
	args: {
		value: "Pre-filled value",
		placeholder: "This has a value",
	},
};

export const FormExample: Story = {
	render: () => (
		<div className="space-y-4 w-80">
			<div className="space-y-2">
				<Label htmlFor="firstName">First Name</Label>
				<Input id="firstName" placeholder="John" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="lastName">Last Name</Label>
				<Input id="lastName" placeholder="Doe" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" placeholder="john@example.com" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="phone">Phone</Label>
				<Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
			</div>
		</div>
	),
};
