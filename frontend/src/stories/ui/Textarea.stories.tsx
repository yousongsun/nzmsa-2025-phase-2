import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const meta = {
	title: "UI/Textarea",
	component: Textarea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		placeholder: {
			control: "text",
		},
		disabled: {
			control: "boolean",
		},
		rows: {
			control: "number",
		},
	},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: "Enter your message...",
	},
};

export const WithLabel: Story = {
	render: () => (
		<div className="space-y-2 w-80">
			<Label htmlFor="message">Message</Label>
			<Textarea id="message" placeholder="Enter your message here..." />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		placeholder: "This textarea is disabled",
		disabled: true,
	},
};

export const WithValue: Story = {
	args: {
		value: "This is a pre-filled textarea with some sample content.",
		placeholder: "Enter text...",
	},
};

export const LargeTextarea: Story = {
	args: {
		placeholder: "A larger textarea for longer content...",
		rows: 8,
		className: "min-h-32",
	},
};

export const FormExample: Story = {
	render: () => (
		<div className="space-y-4 w-96">
			<div className="space-y-2">
				<Label htmlFor="feedback">Feedback</Label>
				<Textarea
					id="feedback"
					placeholder="Please share your feedback..."
					rows={4}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="comments">Additional Comments</Label>
				<Textarea
					id="comments"
					placeholder="Any additional comments..."
					rows={3}
				/>
			</div>
		</div>
	),
};
