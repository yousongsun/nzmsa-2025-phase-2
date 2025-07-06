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
import type { User } from "@/models/user";
import { getItineraryItems } from "@/services/ItineraryItemService";
import { getSharedTrips } from "@/services/SharedTripService";
import { getTripById } from "@/services/TripService";
import { getUserById } from "@/services/UserService";

const TripDetails = () => {
	const { id } = useParams<{ id: string }>();
	const [trip, setTrip] = useState<Trip | null>(null);
	const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
	const [sharedTrips, setSharedTrips] = useState<SharedTrip[]>([]);
	const [sharedUsers, setSharedUsers] = useState<User[]>([]);
	const [showCreateItineraryItemForm, setShowCreateItineraryItemForm] =
		useState(false);
	const [showShareTripForm, setShowShareTripForm] = useState(false);
	const [selectedLocationId, setSelectedLocationId] = useState<string>("");
	const [showRouteLines, setShowRouteLines] = useState(true);

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

					// Fetch user information for shared trips
					if (fetchedSharedTrips.length > 0) {
						const userPromises = fetchedSharedTrips.map((sharedTrip) =>
							getUserById(sharedTrip.userId).catch(() => null),
						);
						const users = await Promise.all(userPromises);
						setSharedUsers(users.filter((user): user is User => user !== null));
					}
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

	const handleSharedTripCreated = async (newSharedTrip: SharedTrip) => {
		const updatedSharedTrips = [...sharedTrips, newSharedTrip];
		setSharedTrips(updatedSharedTrips);
		setShowShareTripForm(false);

		// Fetch user information for the new shared trip
		try {
			const user = await getUserById(newSharedTrip.userId);
			setSharedUsers((prevUsers) => {
				// Check if user already exists to avoid duplicates
				const userExists = prevUsers.some((u) => u.userId === user.userId);
				return userExists ? prevUsers : [...prevUsers, user];
			});
		} catch (error) {
			console.error("Failed to fetch user information:", error);
		}
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

	const getUserDisplayName = (user: User): string => {
		return `${user.firstName} ${user.lastName}`;
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
							existingSharedTrips={sharedTrips}
							existingUsers={sharedUsers}
							onSharedTripCreated={handleSharedTripCreated}
						/>
					</div>
				)}
			</Card>

			{/* Trip Map */}
			<Card className="p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Trip Map</h2>
					<Button
						variant="outline"
						onClick={() => setShowRouteLines(!showRouteLines)}
						className="text-sm"
					>
						{showRouteLines ? "Hide Route" : "Show Route"}
					</Button>
				</div>
				<TripMap
					trip={trip}
					itineraryItems={itineraryItems}
					onLocationClick={handleLocationClick}
					className="h-96 w-full rounded-lg"
					showRouteLines={showRouteLines}
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
						sharedTrips.map((sharedTrip) => {
							const user = sharedUsers.find(
								(u) => u.userId === sharedTrip.userId,
							);
							return (
								<div
									key={sharedTrip.sharedTripId}
									className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
								>
									<div>
										<p className="font-medium">
											{user
												? getUserDisplayName(user)
												: `User ID: ${sharedTrip.userId}`}
										</p>
										{user && (
											<p className="text-sm text-gray-500">{user.email}</p>
										)}
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											sharedTrip.permissionLevel === "Edit"
												? "bg-green-100 text-green-800"
												: "bg-blue-100 text-blue-800"
										}`}
									>
										{sharedTrip.permissionLevel}
									</span>
								</div>
							);
						})
					)}
				</div>
			</Card>
		</div>
	);
};

export default TripDetails;
