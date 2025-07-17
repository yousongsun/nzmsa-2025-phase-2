import type { Meta, StoryObj } from "@storybook/react";
import ProfileRedirect from "@/components/ProfileRedirect";

const meta = {
	title: "Components/ProfileRedirect",
	component: ProfileRedirect,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ProfileRedirect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="text-center p-8">
			<p className="text-muted-foreground">
				ProfileRedirect component handles automatic redirection.
				<br />
				In the actual app, this redirects to the user's profile page.
				<br />
				In Storybook, the redirect functionality is simulated.
			</p>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"This component automatically redirects users to their profile page. The actual redirect behavior is not visible in Storybook.",
			},
		},
	},
};
