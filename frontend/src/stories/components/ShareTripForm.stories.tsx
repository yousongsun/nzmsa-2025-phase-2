import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ShareTripDialog } from "@/components/ShareTripForm";
import { store } from "@/redux/store";

const meta = {
	title: "Components/ShareTripForm",
	component: ShareTripDialog,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<Provider store={store}>
				<BrowserRouter>
					<Story />
				</BrowserRouter>
			</Provider>
		),
	],
	argTypes: {
		onSharedTripCreated: { action: "shared trip created" },
	},
} satisfies Meta<typeof ShareTripDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		tripId: 1,
		tripName: "Amazing Trip to New Zealand",
		onSharedTripCreated: (sharedTrip) => console.log("Shared trip created:", sharedTrip),
		trigger: <button type="button">Share Trip</button>,
	},
};

export const WithoutTrigger: Story = {
	args: {
		tripId: 2,
		tripName: "European Adventure",
		onSharedTripCreated: (sharedTrip) => console.log("Shared trip created:", sharedTrip),
	},
};
