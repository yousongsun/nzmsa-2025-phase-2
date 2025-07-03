import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateItineraryItemForm } from "@/components/CreateItineraryItemForm";
import { ShareTripForm } from "@/components/ShareTripForm";
import { Button } from "@/components/ui/button";
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

	if (!trip) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">{trip.name}</h1>
				<Button onClick={() => setShowShareTripForm(!showShareTripForm)}>
					{showShareTripForm ? "Cancel" : "Share Trip"}
				</Button>
			</div>
			<p>{trip.destination}</p>
			<p>
				{new Date(trip.startDate).toLocaleDateString()} -{" "}
				{new Date(trip.endDate).toLocaleDateString()}
			</p>

			{showShareTripForm && (
				<ShareTripForm
					tripId={trip.tripId}
					onSharedTripCreated={handleSharedTripCreated}
				/>
			)}

			<div className="flex justify-between items-center mt-4">
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
				<CreateItineraryItemForm
					tripId={trip.tripId}
					onItineraryItemCreated={handleItineraryItemCreated}
				/>
			)}

			<ul className="mt-4">
				{itineraryItems.map((item) => (
					<li key={item.itineraryItemId} className="p-4 border-b">
						<h3 className="text-lg font-semibold">{item.name}</h3>
						<p>{item.type}</p>
						<p>
							{new Date(item.startTime).toLocaleString()} -{" "}
							{new Date(item.endTime).toLocaleString()}
						</p>
					</li>
				))}
			</ul>

			<div className="mt-4">
				<h2 className="text-xl font-bold">Shared With</h2>
				<ul>
					{sharedTrips.map((sharedTrip) => (
						<li key={sharedTrip.sharedTripId} className="p-4 border-b">
							<p>User ID: {sharedTrip.userId}</p>
							<p>Permission: {sharedTrip.permissionLevel}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default TripDetails;
