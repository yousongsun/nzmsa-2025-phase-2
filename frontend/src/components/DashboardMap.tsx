import React from "react";
import { useNavigate } from "react-router-dom";
import { BaseMap } from "@/components/ui/map";
import type { Trip } from "@/models/trip";

interface DashboardMapProps {
	trips: Trip[];
	onTripClick?: (trip: Trip) => void;
	className?: string;
}

export const DashboardMap: React.FC<DashboardMapProps> = ({
	trips,
	onTripClick,
	className = "h-96 w-full rounded-lg",
}) => {
	const navigate = useNavigate();

	const locations = React.useMemo(() => {
		return trips
			.filter((trip) => trip.latitude && trip.longitude)
			.map((trip) => ({
				id: `trip-${trip.tripId}`,
				latitude: trip.latitude!,
				longitude: trip.longitude!,
				title: trip.name || "Untitled Trip",
				description: `${trip.destination} • ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`,
				type: "trip" as const,
				data: trip,
			}));
	}, [trips]);

	const handleLocationClick = React.useCallback(
		(location: any) => {
			const trip = location.data as Trip;
			if (onTripClick) {
				onTripClick(trip);
			} else {
				// Default behavior: navigate to trip details
				navigate(`/trip/${trip.tripId}`);
			}
		},
		[onTripClick, navigate],
	);

	if (locations.length === 0) {
		return (
			<div
				className={`${className} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center`}
			>
				<div className="text-center text-gray-500">
					<p className="text-lg">No trips with locations to display</p>
					<p className="text-sm">
						Create trips with locations to see them on the map
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
		/>
	);
};
