import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import { DashboardMap } from "@/components/DashboardMap";
import type { Trip } from "@/models/trip";

const mockTrips: Trip[] = [
	{
		tripId: 1,
		name: "Auckland Adventure",
		destination: "Auckland, New Zealand",
		startDate: "2024-08-01",
		endDate: "2024-08-10",
		latitude: -36.8485,
		longitude: 174.7633,
		address: "Auckland, New Zealand",
		userId: 1,
		createdAt: "2024-07-01T00:00:00Z",
		updatedAt: "2024-07-01T00:00:00Z",
	},
	{
		tripId: 2,
		name: "Wellington Getaway",
		destination: "Wellington, New Zealand",
		startDate: "2024-09-01",
		endDate: "2024-09-05",
		latitude: -41.2924,
		longitude: 174.7787,
		address: "Wellington, New Zealand",
		userId: 1,
		createdAt: "2024-07-01T00:00:00Z",
		updatedAt: "2024-07-01T00:00:00Z",
	},
];

const meta = {
	title: "Components/DashboardMap",
	component: DashboardMap,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<BrowserRouter>
				<div style={{ padding: "20px", height: "100vh" }}>
					<Story />
				</div>
			</BrowserRouter>
		),
	],
	argTypes: {
		onTripClick: { action: "trip clicked" },
	},
} satisfies Meta<typeof DashboardMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		trips: mockTrips,
		onTripClick: (trip: Trip) => console.log("Trip clicked:", trip),
	},
};

export const SingleTrip: Story = {
	args: {
		trips: [mockTrips[0]],
		onTripClick: (trip: Trip) => console.log("Trip clicked:", trip),
	},
};

export const NoTrips: Story = {
	args: {
		trips: [],
		onTripClick: (trip: Trip) => console.log("Trip clicked:", trip),
	},
};

export const CustomClass: Story = {
	args: {
		trips: mockTrips,
		className: "h-64 w-full border-2 border-blue-500 rounded-xl",
		onTripClick: (trip: Trip) => console.log("Trip clicked:", trip),
	},
};
