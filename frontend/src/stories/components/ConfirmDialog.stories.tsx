import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";

const meta = {
	title: "Components/ConfirmDialog",
	component: ConfirmDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		onConfirm: { action: "confirmed" },
		title: { control: "text" },
		description: { control: "text" },
		confirmText: { control: "text" },
		cancelText: { control: "text" },
	},
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onConfirm: () => console.log("Confirmed!"),
		trigger: <Button variant="destructive">Delete Item</Button>,
	},
};

export const CustomTitle: Story = {
	args: {
		onConfirm: () => console.log("Account deleted!"),
		title: "Delete Account?",
		description:
			"This action cannot be undone. All your data will be permanently deleted.",
		trigger: <Button variant="destructive">Delete Account</Button>,
	},
};

export const CustomButtons: Story = {
	args: {
		onConfirm: () => console.log("Reset confirmed!"),
		title: "Reset Settings?",
		description: "This will reset all your settings to default values.",
		confirmText: "Reset Now",
		cancelText: "Keep Current",
		trigger: <Button variant="outline">Reset Settings</Button>,
	},
};

export const SimpleConfirm: Story = {
	args: {
		onConfirm: () => console.log("Action confirmed!"),
		title: "Continue?",
		trigger: <Button>Continue Process</Button>,
	},
};

export const LongDescription: Story = {
	args: {
		onConfirm: () => console.log("Migration started!"),
		title: "Start Data Migration?",
		description:
			"This process will migrate all your data to the new format. It may take several hours to complete and cannot be interrupted once started. Please ensure you have a stable internet connection.",
		confirmText: "Start Migration",
		cancelText: "Not Now",
		trigger: <Button>Migrate Data</Button>,
	},
};

export const MultipleDialogs: Story = {
	render: () => (
		<div className="flex gap-4">
			<ConfirmDialog
				onConfirm={() => console.log("Item 1 deleted")}
				title="Delete Item 1?"
				trigger={
					<Button variant="destructive" size="sm">
						Delete 1
					</Button>
				}
			/>
			<ConfirmDialog
				onConfirm={() => console.log("Item 2 deleted")}
				title="Delete Item 2?"
				trigger={
					<Button variant="destructive" size="sm">
						Delete 2
					</Button>
				}
			/>
			<ConfirmDialog
				onConfirm={() => console.log("All items deleted")}
				title="Delete All Items?"
				description="This will delete all items in your collection."
				trigger={<Button variant="destructive">Delete All</Button>}
			/>
		</div>
	),
};
