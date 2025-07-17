import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const meta = {
	title: "UI/Avatar",
	component: Avatar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
};

export const WithFallback: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="invalid-url" alt="Avatar" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

export const LargeAvatar: Story = {
	render: () => (
		<Avatar className="h-16 w-16">
			<AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
};

export const SmallAvatar: Story = {
	render: () => (
		<Avatar className="h-6 w-6">
			<AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
};
