import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const meta = {
	title: "UI/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card description goes here.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card content goes here.</p>
			</CardContent>
			<CardFooter>
				<Button>Action</Button>
			</CardFooter>
		</Card>
	),
};

export const WithAction: Story = {
	render: () => (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Card with Action</CardTitle>
				<CardDescription>
					This card has an action button in the header.
				</CardDescription>
				<CardAction>
					<Button variant="outline" size="sm">
						Edit
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>Card content with action button.</p>
			</CardContent>
		</Card>
	),
};

export const SimpleCard: Story = {
	render: () => (
		<Card className="w-80">
			<CardContent>
				<p>A simple card with just content.</p>
			</CardContent>
		</Card>
	),
};

export const FullCard: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Complete Card Example</CardTitle>
				<CardDescription>
					This card demonstrates all the available components.
				</CardDescription>
				<CardAction>
					<Button variant="ghost" size="icon">
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
							<circle cx="12" cy="12" r="1" />
							<circle cx="12" cy="5" r="1" />
							<circle cx="12" cy="19" r="1" />
						</svg>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<p>This is the main content area of the card.</p>
					<div className="text-sm text-muted-foreground">
						Additional information can go here.
					</div>
				</div>
			</CardContent>
			<CardFooter className="justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Save</Button>
			</CardFooter>
		</Card>
	),
};

export const MultipleCards: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
			<Card>
				<CardHeader>
					<CardTitle>Card 1</CardTitle>
					<CardDescription>First card description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Content for the first card.</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Card 2</CardTitle>
					<CardDescription>Second card description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Content for the second card.</p>
				</CardContent>
			</Card>
		</div>
	),
};
