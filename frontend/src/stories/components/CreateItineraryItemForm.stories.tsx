import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CreateItineraryItemForm } from "@/components/CreateItineraryItemForm";
import { store } from "@/redux/store";

const meta = {
	title: "Components/CreateItineraryItemForm",
	component: CreateItineraryItemForm,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<Provider store={store}>
				<BrowserRouter>
					<div style={{ width: "600px", padding: "20px" }}>
						<Story />
					</div>
				</BrowserRouter>
			</Provider>
		),
	],
	argTypes: {
		onItineraryItemCreated: { action: "itinerary item created" },
	},
} satisfies Meta<typeof CreateItineraryItemForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		tripId: 1,
		onItineraryItemCreated: (item) =>
			console.log("Itinerary item created:", item),
	},
};

export const DifferentTrip: Story = {
	args: {
		tripId: 2,
		onItineraryItemCreated: (item) =>
			console.log("Itinerary item created:", item),
	},
};
