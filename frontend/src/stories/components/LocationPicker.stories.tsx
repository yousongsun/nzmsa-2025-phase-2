import type { Meta, StoryObj } from "@storybook/react";
import { LocationPicker } from "@/components/LocationPicker";

const meta = {
	title: "Components/LocationPicker",
	component: LocationPicker,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div style={{ width: "600px", height: "400px", padding: "20px" }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		onLocationChange: { action: "location changed" },
		onAddressChange: { action: "address changed" },
	},
} satisfies Meta<typeof LocationPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onLocationChange: (location) => console.log("Location changed:", location),
		onAddressChange: (address) => console.log("Address changed:", address),
	},
};

export const WithInitialLocation: Story = {
	args: {
		latitude: -36.8485,
		longitude: 174.7633,
		address: "Auckland, New Zealand",
		onLocationChange: (location) => console.log("Location changed:", location),
		onAddressChange: (address) => console.log("Address changed:", address),
	},
};

export const CustomClass: Story = {
	args: {
		className: "border-2 border-blue-500",
		onLocationChange: (location) => console.log("Location changed:", location),
		onAddressChange: (address) => console.log("Address changed:", address),
	},
};
