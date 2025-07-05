export const ItineraryItemType = {
	Flight: "Flight",
	Hotel: "Hotel",
	Activity: "Activity",
} as const;

export type ItineraryItemType =
	(typeof ItineraryItemType)[keyof typeof ItineraryItemType];

export interface ItineraryItem {
	itineraryItemId: number;
	name: string;
	type: ItineraryItemType;
	startTime: string;
	endTime: string;
	tripId: number;
	// Location coordinates for map markers
	latitude?: number;
	longitude?: number;
	address?: string;
}
