import React from "react";
import { BaseMap } from "@/components/ui/map";
import type { ItineraryItem } from "@/models/itinerary-item";
import type { Trip } from "@/models/trip";

interface TripMapProps {
	trip: Trip;
	itineraryItems: ItineraryItem[];
	onLocationClick?: (location: {
		type: "trip" | "item";
		data: Trip | ItineraryItem;
	}) => void;
	className?: string;
	showRouteLines?: boolean;
}

export const TripMap: React.FC<TripMapProps> = ({
	trip,
	itineraryItems,
	onLocationClick,
	className = "h-96 w-full rounded-lg",
	showRouteLines = true,
}) => {
	const locations = React.useMemo(() => {
		const mapLocations = [];

		// Add trip destination if coordinates are available
		if (trip.latitude && trip.longitude) {
			mapLocations.push({
				id: `trip-${trip.tripId}`,
				latitude: trip.latitude,
				longitude: trip.longitude,
				title: trip.name || "Trip Destination",
				description: trip.destination,
				type: "trip" as const,
				data: trip,
				startTime: trip.startDate, // Use trip start date for ordering
			});
		}

		// Add itinerary items with coordinates
		itineraryItems.forEach((item) => {
			if (item.latitude && item.longitude) {
				mapLocations.push({
					id: `item-${item.itineraryItemId}`,
					latitude: item.latitude,
					longitude: item.longitude,
					title: item.name || "Itinerary Item",
					description:
						item.address ||
						`${item.type} - ${new Date(item.startTime).toLocaleDateString()}`,
					type: item.type,
					data: item,
					startTime: item.startTime,
				});
			}
		});

		return mapLocations;
	}, [trip, itineraryItems]);

	const handleLocationClick = React.useCallback(
		(location: any) => {
			if (onLocationClick) {
				onLocationClick({
					type: location.type === "trip" ? "trip" : "item",
					data: location.data,
				});
			}
		},
		[onLocationClick],
	);

	if (locations.length === 0) {
		return (
			<div
				className={`${className} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center`}
			>
				<div className="text-center text-gray-500">
					<p className="text-lg">No locations to display</p>
					<p className="text-sm">
						Add location coordinates to see items on the map
					</p>
				</div>
			</div>
		);
	}

	return (
		<BaseMap
			locations={locations}
			onLocationClick={handleLocationClick}
			className={className}
			showRouteLines={showRouteLines}
		/>
	);
};
