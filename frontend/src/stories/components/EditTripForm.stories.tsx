import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { EditTripDialog } from "@/components/EditTripForm";
import type { Trip } from "@/models/trip";
import { store } from "@/redux/store";

const mockTrip: Trip = {
	id: 1,
	name: "Sample Trip",
	destination: "Auckland, New Zealand",
	startDate: "2024-08-01",
	endDate: "2024-08-10",
	latitude: -36.8485,
	longitude: 174.7633,
	address: "Auckland, New Zealand",
	userId: 1,
	createdAt: "2024-07-01T00:00:00Z",
	updatedAt: "2024-07-01T00:00:00Z",
};

const meta = {
	title: "Components/EditTripForm",
	component: EditTripDialog,
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
		onTripUpdated: { action: "trip updated" },
	},
} satisfies Meta<typeof EditTripDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		trip: mockTrip,
		onTripUpdated: (trip: Trip) => console.log("Trip updated:", trip),
		trigger: <button type="button">Edit Trip</button>,
	},
};

export const WithoutTrigger: Story = {
	args: {
		trip: mockTrip,
		onTripUpdated: (trip: Trip) => console.log("Trip updated:", trip),
	},
};
