import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CreateItineraryItemForm } from "@/components/CreateItineraryItemForm";
import { EditItineraryItemDialog } from "@/components/EditItineraryItemForm";
import { EditSharedTripDialog } from "@/components/EditSharedTripForm";
import { EditTripDialog } from "@/components/EditTripForm";
import { ShareTripDialog } from "@/components/ShareTripForm";
import { TripMap } from "@/components/TripMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ItineraryItem } from "@/models/itinerary-item";
import type { SharedTrip } from "@/models/shared-trip";
import type { Trip } from "@/models/trip";
import type { User } from "@/models/user";
import {
	deleteItineraryItem,
	getItineraryItems,
} from "@/services/ItineraryItemService";
import { deleteSharedTrip, getSharedTrips } from "@/services/SharedTripService";
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

	const handleTripUpdated = (updatedTrip: Trip) => {
		setTrip(updatedTrip);
	};

	const handleItineraryItemUpdated = (updatedItem: ItineraryItem) => {
		setItineraryItems((items) =>
			items.map((it) =>
				it.itineraryItemId === updatedItem.itineraryItemId ? updatedItem : it,
			),
		);
	};

	const handleSharedTripUpdated = (updatedShared: SharedTrip) => {
		setSharedTrips((items) =>
			items.map((st) =>
				st.sharedTripId === updatedShared.sharedTripId ? updatedShared : st,
			),
		);
	};

	const handleItineraryItemDeleted = async (itemId: number) => {
		if (!trip) return;
		try {
			await deleteItineraryItem(trip.tripId, itemId);
			setItineraryItems((items) =>
				items.filter((it) => it.itineraryItemId !== itemId),
			);
		} catch (error) {
			console.error("Failed to delete itinerary item:", error);
		}
	};

	const handleSharedTripDeleted = async (sharedTripId: number) => {
		if (!trip) return;
		try {
			await deleteSharedTrip(trip.tripId, sharedTripId);
			setSharedTrips((items) =>
				items.filter((st) => st.sharedTripId !== sharedTripId),
			);
		} catch (error) {
			console.error("Failed to delete shared trip:", error);
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
		return (
			<div className="container mx-auto p-4">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-lg">Loading trip details...</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto p-4 space-y-6">
				{/* Trip Header */}
				<Card className="p-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
							<p className="text-lg text-muted-foreground mb-2">
								{trip.destination}
							</p>
							<p className="text-sm text-muted-foreground">
								{new Date(trip.startDate).toLocaleDateString()} -{" "}
								{new Date(trip.endDate).toLocaleDateString()}
							</p>
						</div>
						<div className="flex gap-2">
							<EditTripDialog
								trip={trip}
								onTripUpdated={handleTripUpdated}
								trigger={<Button variant="outline">Edit Trip</Button>}
							/>
							<ShareTripDialog
								tripId={trip.tripId}
								tripName={trip.name}
								onSharedTripCreated={handleSharedTripCreated}
								trigger={
									<Button variant="outline">
										<svg
											className="w-4 h-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Share Trip Icon</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367-2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
											/>
										</svg>
										Share Trip
									</Button>
								}
							/>
						</div>
					</div>
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
						<div className="mb-6 p-4 bg-muted rounded-lg">
							<CreateItineraryItemForm
								tripId={trip.tripId}
								onItineraryItemCreated={handleItineraryItemCreated}
							/>
						</div>
					)}

					<div className="space-y-4">
						{itineraryItems.length === 0 ? (
							<p className="text-muted-foreground text-center py-8">
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
									<div key={item.itineraryItemId} className="relative group">
										<button
											type="button"
											className={`w-full text-left p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
												selectedLocationId === `item-${item.itineraryItemId}`
													? "border-blue-500 bg-blue-150"
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
											<p className="text-sm text-muted-foreground mb-2">
												{new Date(item.startTime).toLocaleString()} -{" "}
												{new Date(item.endTime).toLocaleString()}
											</p>
											{item.address && (
												<p className="text-sm text-muted-foreground">
													📍 {item.address}
												</p>
											)}
											{item.latitude && item.longitude && (
												<p className="text-xs text-muted-foreground mt-1">
													Coordinates: {item.latitude.toFixed(4)},{" "}
													{item.longitude.toFixed(4)}
												</p>
											)}
										</button>
										<div className="absolute top-2 right-2 flex gap-2 rounded-md bg-background/90 p-1 shadow pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity backdrop-blur-sm">
											<EditItineraryItemDialog
												tripId={trip.tripId}
												item={item}
												onItineraryItemUpdated={handleItineraryItemUpdated}
												trigger={
													<Button variant="ghost" size="icon">
														<svg
															className="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>Edit Itinerary Item Icon</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M15.232 5.232l3.536 3.536M9 11l3.232 3.232m0 0L20.768 5.232a2.5 2.5 0 00-3.536-3.536L8.696 10.696M12.232 14.232L9 17.464V21h3.536l3.232-3.232"
															/>
														</svg>
													</Button>
												}
											/>
											<ConfirmDialog
												title="Delete this item?"
												onConfirm={() =>
													handleItineraryItemDeleted(item.itineraryItemId)
												}
												trigger={
													<Button variant="ghost" size="icon">
														<svg
															className="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>Delete Item Icon</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M6 18L18 6M6 6l12 12"
															/>
														</svg>
													</Button>
												}
											/>
										</div>
									</div>
								))
						)}
					</div>
				</Card>

				{/* Shared With Section */}
				<Card className="p-6">
					<h2 className="text-xl font-bold mb-4">Shared With</h2>
					<div className="space-y-3">
						{sharedTrips.length === 0 ? (
							<p className="text-muted-foreground text-center py-4">
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
										className="p-3 bg-muted rounded-lg flex justify-between items-center group"
									>
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
												{user
													? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
													: "?"}
											</div>
											<div>
												<p className="font-medium">
													{user
														? getUserDisplayName(user)
														: `User ID: ${sharedTrip.userId}`}
												</p>
												{user && (
													<p className="text-sm text-muted-foreground">
														{user.email}
													</p>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="relative flex items-center">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														sharedTrip.permissionLevel === "Edit"
															? "bg-green-100 text-green-800"
															: "bg-blue-100 text-blue-800"
													}`}
												>
													{sharedTrip.permissionLevel}
												</span>
												<div className="absolute -top-1 -right-1 flex gap-2 rounded-md bg-background/90 p-1 shadow pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity backdrop-blur-sm">
													<EditSharedTripDialog
														tripId={trip.tripId}
														sharedTrip={sharedTrip}
														onSharedTripUpdated={handleSharedTripUpdated}
														trigger={
															<Button variant="ghost" size="icon">
																<svg
																	className="w-4 h-4"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<title>Edit Shared Trip Icon</title>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M15.232 5.232l3.536 3.536M9 11l3.232 3.232m0 0L20.768 5.232a2.5 2.5 0 00-3.536-3.536L8.696 10.696M12.232 14.232L9 17.464V21h3.536l3.232-3.232"
																	/>
																</svg>
															</Button>
														}
													/>
													<ConfirmDialog
														title="Remove this user from the trip?"
														onConfirm={() =>
															handleSharedTripDeleted(sharedTrip.sharedTripId)
														}
														trigger={
															<Button variant="ghost" size="icon">
																<svg
																	className="w-4 h-4"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<title>Delete Share Icon</title>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M6 18L18 6M6 6l12 12"
																	/>
																</svg>
															</Button>
														}
													/>
												</div>
											</div>
										</div>
									</div>
								);
							})
						)}
					</div>
				</Card>
			</div>
		</>
	);
};

export default TripDetails;
