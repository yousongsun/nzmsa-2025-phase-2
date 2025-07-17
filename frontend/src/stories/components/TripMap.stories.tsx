import type { Meta, StoryObj } from "@storybook/react";
import { TripMap } from "@/components/TripMap";
import type { ItineraryItem } from "@/models/itinerary-item";
import { ItineraryItemType } from "@/models/itinerary-item";
import type { Trip } from "@/models/trip";

const mockTrip: Trip = {
	tripId: 1,
	name: "New Zealand Adventure",
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

const mockItineraryItems: ItineraryItem[] = [
	{
		id: 1,
		name: "Sky Tower Visit",
		type: ItineraryItemType.Activity,
		startTime: "2024-08-02T10:00:00Z",
		endTime: "2024-08-02T12:00:00Z",
		latitude: -36.8485,
		longitude: 174.7633,
		address: "Sky Tower, Auckland",
		tripId: 1,
		notes: "Visit the iconic Sky Tower",
		createdAt: "2024-07-01T00:00:00Z",
		updatedAt: "2024-07-01T00:00:00Z",
	},
	{
		id: 2,
		name: "Harbor Hotel",
		type: ItineraryItemType.Accommodation,
		startTime: "2024-08-01T15:00:00Z",
		endTime: "2024-08-10T11:00:00Z",
		latitude: -36.8405,
		longitude: 174.7598,
		address: "Auckland Harbor, New Zealand",
		tripId: 1,
		notes: "Waterfront hotel with great views",
		createdAt: "2024-07-01T00:00:00Z",
		updatedAt: "2024-07-01T00:00:00Z",
	},
];

const meta = {
	title: "Components/TripMap",
	component: TripMap,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div style={{ padding: "20px", height: "100vh" }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		onLocationClick: { action: "location clicked" },
	},
} satisfies Meta<typeof TripMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		trip: mockTrip,
		itineraryItems: mockItineraryItems,
		onLocationClick: (location) => console.log("Location clicked:", location),
	},
};

export const TripOnly: Story = {
	args: {
		trip: mockTrip,
		itineraryItems: [],
		onLocationClick: (location) => console.log("Location clicked:", location),
	},
};

export const WithoutRouteLines: Story = {
	args: {
		trip: mockTrip,
		itineraryItems: mockItineraryItems,
		showRouteLines: false,
		onLocationClick: (location) => console.log("Location clicked:", location),
	},
};

export const CustomClass: Story = {
	args: {
		trip: mockTrip,
		itineraryItems: mockItineraryItems,
		className: "h-64 w-full border-4 border-green-500 rounded-2xl",
		onLocationClick: (location) => console.log("Location clicked:", location),
	},
};
