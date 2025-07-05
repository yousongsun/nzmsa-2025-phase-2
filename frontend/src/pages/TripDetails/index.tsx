import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateItineraryItemForm } from "@/components/CreateItineraryItemForm";
import { ShareTripForm } from "@/components/ShareTripForm";
import { TripMap } from "@/components/TripMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ItineraryItem } from "@/models/itinerary-item";
import type { SharedTrip } from "@/models/shared-trip";
import type { Trip } from "@/models/trip";
import { getItineraryItems } from "@/services/ItineraryItemService";
import { getSharedTrips } from "@/services/SharedTripService";
import { getTripById } from "@/services/TripService";

const TripDetails = () => {
	const { id } = useParams<{ id: string }>();
	const [trip, setTrip] = useState<Trip | null>(null);
	const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
	const [sharedTrips, setSharedTrips] = useState<SharedTrip[]>([]);
	const [showCreateItineraryItemForm, setShowCreateItineraryItemForm] =
		useState(false);
	const [showShareTripForm, setShowShareTripForm] = useState(false);
	const [selectedLocationId, setSelectedLocationId] = useState<string>("");

	useEffect(() => {
		const fetchTripDetails = async () => {
			if (id) {
				try {
					const tripId = parseInt(id, 10);
					const fetchedTrip = await getTripById(tripId);
					const fetchedItineraryItems = await getItineraryItems(tripId);
					const fetchedSharedTrips = await getSharedTrips(tripId);
					setTrip(fetchedTrip);
					setItineraryItems(fetchedItineraryItems);
					setSharedTrips(fetchedSharedTrips);
				} catch (error) {
					console.error("Failed to fetch trip details:", error);
				}
			}
		};

		fetchTripDetails();
	}, [id]);

	const handleItineraryItemCreated = (newItineraryItem: ItineraryItem) => {
		setItineraryItems([...itineraryItems, newItineraryItem]);
		setShowCreateItineraryItemForm(false);
	};

	const handleSharedTripCreated = (newSharedTrip: SharedTrip) => {
		setSharedTrips([...sharedTrips, newSharedTrip]);
		setShowShareTripForm(false);
	};

	const handleLocationClick = (location: {
		type: "trip" | "item";
		data: Trip | ItineraryItem;
	}) => {
		if (location.type === "item") {
			const item = location.data as ItineraryItem;
			setSelectedLocationId(`item-${item.itineraryItemId}`);
		} else {
			const tripData = location.data as Trip;
			setSelectedLocationId(`trip-${tripData.tripId}`);
		}
	};

	if (!trip) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			{/* Trip Header */}
			<Card className="p-6">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-3xl font-bold">{trip.name}</h1>
					<Button onClick={() => setShowShareTripForm(!showShareTripForm)}>
						{showShareTripForm ? "Cancel" : "Share Trip"}
					</Button>
				</div>
				<p className="text-lg text-gray-600 mb-2">{trip.destination}</p>
				<p className="text-sm text-gray-500">
					{new Date(trip.startDate).toLocaleDateString()} -{" "}
					{new Date(trip.endDate).toLocaleDateString()}
				</p>

				{showShareTripForm && (
					<div className="mt-4 pt-4 border-t">
						<ShareTripForm
							tripId={trip.tripId}
							onSharedTripCreated={handleSharedTripCreated}
						/>
					</div>
				)}
			</Card>

			{/* Trip Map */}
			<Card className="p-6">
				<h2 className="text-xl font-bold mb-4">Trip Map</h2>
				<TripMap
					trip={trip}
					itineraryItems={itineraryItems}
					onLocationClick={handleLocationClick}
					className="h-96 w-full rounded-lg"
				/>
			</Card>

			{/* Itinerary Section */}
			<Card className="p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Itinerary</h2>
					<Button
						onClick={() =>
							setShowCreateItineraryItemForm(!showCreateItineraryItemForm)
						}
					>
						{showCreateItineraryItemForm ? "Cancel" : "Add Itinerary Item"}
					</Button>
				</div>

				{showCreateItineraryItemForm && (
					<div className="mb-6 p-4 bg-gray-50 rounded-lg">
						<CreateItineraryItemForm
							tripId={trip.tripId}
							onItineraryItemCreated={handleItineraryItemCreated}
						/>
					</div>
				)}

				<div className="space-y-4">
					{itineraryItems.length === 0 ? (
						<p className="text-gray-500 text-center py-8">
							No itinerary items yet. Add some to see them on the map!
						</p>
					) : (
						itineraryItems
							.sort(
								(a, b) =>
									new Date(a.startTime).getTime() -
									new Date(b.startTime).getTime(),
							)
							.map((item) => (
								<button
									type="button"
									key={item.itineraryItemId}
									className={`w-full text-left p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										selectedLocationId === `item-${item.itineraryItemId}`
											? "border-blue-500 bg-blue-50"
											: "border-gray-200 hover:border-gray-300"
									}`}
									onClick={() =>
										setSelectedLocationId(`item-${item.itineraryItemId}`)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											setSelectedLocationId(`item-${item.itineraryItemId}`);
										}
									}}
									tabIndex={0}
									aria-pressed={
										selectedLocationId === `item-${item.itineraryItemId}`
									}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold">{item.name}</h3>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												item.type === "Flight"
													? "bg-blue-100 text-blue-800"
													: item.type === "Hotel"
														? "bg-green-100 text-green-800"
														: "bg-purple-100 text-purple-800"
											}`}
										>
											{item.type}
										</span>
									</div>
									<p className="text-sm text-gray-600 mb-2">
										{new Date(item.startTime).toLocaleString()} -{" "}
										{new Date(item.endTime).toLocaleString()}
									</p>
									{item.address && (
										<p className="text-sm text-gray-500">📍 {item.address}</p>
									)}
									{item.latitude && item.longitude && (
										<p className="text-xs text-gray-400 mt-1">
											Coordinates: {item.latitude.toFixed(4)},{" "}
											{item.longitude.toFixed(4)}
										</p>
									)}
								</button>
							))
					)}
				</div>
			</Card>

			{/* Shared With Section */}
			<Card className="p-6">
				<h2 className="text-xl font-bold mb-4">Shared With</h2>
				<div className="space-y-3">
					{sharedTrips.length === 0 ? (
						<p className="text-gray-500 text-center py-4">
							This trip hasn't been shared with anyone yet.
						</p>
					) : (
						sharedTrips.map((sharedTrip) => (
							<div
								key={sharedTrip.sharedTripId}
								className="p-3 bg-gray-50 rounded-lg"
							>
								<p className="font-medium">User ID: {sharedTrip.userId}</p>
								<p className="text-sm text-gray-600">
									Permission: {sharedTrip.permissionLevel}
								</p>
							</div>
						))
					)}
				</div>
			</Card>
		</div>
	);
};

export default TripDetails;
