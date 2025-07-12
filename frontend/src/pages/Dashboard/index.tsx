import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CreateTripDialog } from "@/components/CreateTripForm";
import { EditTripDialog } from "@/components/EditTripForm";
import { UserSearchDialog } from "@/components/UserSearchDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trip } from "@/models/trip";
import { deleteTrip, getTrips } from "@/services/TripService";

const Dashboard = () => {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTrips = async () => {
			try {
				setLoading(true);
				const fetchedTrips = await getTrips();
				setTrips(fetchedTrips);
			} catch (error) {
				console.error("Failed to fetch trips:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTrips();
	}, []);

	const handleTripCreated = (newTrip: Trip) => {
		setTrips([...trips, newTrip]);
	};

	const handleTripUpdated = (updated: Trip) => {
		setTrips((ts) =>
			ts.map((t) => (t.tripId === updated.tripId ? updated : t)),
		);
	};

	const handleTripDeleted = async (id: number) => {
		try {
			await deleteTrip(id);
			setTrips((ts) => ts.filter((t) => t.tripId !== id));
		} catch (err) {
			console.error("Failed to delete trip:", err);
		}
	};

	const formatDateRange = (startDate: string, endDate: string) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const today = new Date();

		const startFormatted = start.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: start.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
		});
		const endFormatted = end.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: end.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
		});

		return `${startFormatted} - ${endFormatted}`;
	};

	const getTripStatus = (startDate: string, endDate: string) => {
		const today = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (today < start) {
			return { status: "upcoming", color: "bg-blue-100 text-blue-800" };
		} else if (today >= start && today <= end) {
			return { status: "ongoing", color: "bg-green-100 text-green-800" };
		} else {
			return { status: "completed", color: "bg-gray-100 text-gray-800" };
		}
	};

	const getDaysUntil = (startDate: string) => {
		const today = new Date();
		const start = new Date(startDate);
		const diffTime = start.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	if (loading) {
		return (
			<div className="container mx-auto p-4">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-lg">Loading your trips...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 max-w-6xl">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Your Trips</h1>
					<p className="text-gray-600 mt-1">
						{trips.length === 0
							? "Ready to plan your next adventure?"
							: `You have ${trips.length} trip${trips.length !== 1 ? "s" : ""}`}
					</p>
				</div>
				<div className="flex gap-3">
					<UserSearchDialog />
					<CreateTripDialog
						onTripCreated={handleTripCreated}
						trigger={
							<Button size="lg">
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Create Trip Icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Create New Trip
							</Button>
						}
					/>
				</div>
			</div>

			{/* Trips Grid */}
			{trips.length === 0 ? (
				<div className="text-center py-16">
					<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
						<svg
							className="w-12 h-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>No trips icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 9l-6 3"
							/>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						No trips yet
					</h3>
					<p className="text-gray-500 mb-6 max-w-md mx-auto">
						Start planning your next adventure by creating your first trip. Add
						destinations, dates, and share with friends!
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<UserSearchDialog
							trigger={
								<Button size="lg" variant="outline">
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Find Friends Icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									Find Friends
								</Button>
							}
						/>
						<CreateTripDialog
							onTripCreated={handleTripCreated}
							trigger={
								<Button size="lg">
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Create Trip Icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4v16m8-8H4"
										/>
									</svg>
									Create Your First Trip
								</Button>
							}
						/>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{trips
						.sort(
							(a, b) =>
								new Date(a.startDate).getTime() -
								new Date(b.startDate).getTime(),
						)
						.map((trip) => {
							const { status, color } = getTripStatus(
								trip.startDate,
								trip.endDate,
							);
							const daysUntil = getDaysUntil(trip.startDate);

							return (
								<Link
									key={trip.tripId}
									to={`/trip/${trip.tripId}`}
									className="group"
									onClick={(e) => {
										if ((e.target as HTMLElement).closest("button")) {
											e.preventDefault();
										}
									}}
								>
									<Card className="relative h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
										<aside className="absolute top-2 right-2 flex gap-2 rounded-md bg-white/90 p-1 shadow pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity backdrop-blur-sm">
											<EditTripDialog
												trip={trip}
												onTripUpdated={handleTripUpdated}
												trigger={
													<Button
														variant="ghost"
														size="icon"
														aria-label="Edit Trip"
													>
														<svg
															className="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>Edit Trip Icon</title>
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
												title="Delete this trip?"
												onConfirm={() => handleTripDeleted(trip.tripId)}
												trigger={
													<Button
														variant="ghost"
														size="icon"
														aria-label="Delete Trip"
													>
														<svg
															className="w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>Delete Trip Icon</title>
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
										</aside>
										<CardHeader className="pb-3">
											<div className="flex justify-between items-start mb-2">
												<CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
													{trip.name}
												</CardTitle>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${color} capitalize`}
												>
													{status}
												</span>
											</div>
											<div className="flex items-center text-gray-600">
												<svg
													className="w-4 h-4 mr-1"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>Destination Icon</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
													/>
												</svg>
												<span className="text-sm font-medium">
													{trip.destination}
												</span>
											</div>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="space-y-3">
												<div className="flex items-center text-sm text-gray-500">
													<svg
														className="w-4 h-4 mr-2"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<title>Calendar Icon</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
														/>
													</svg>
													{formatDateRange(trip.startDate, trip.endDate)}
												</div>

												{status === "upcoming" && daysUntil > 0 && (
													<div className="flex items-center text-sm text-blue-600">
														<svg
															className="w-4 h-4 mr-2"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>Countdown Icon</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														{daysUntil === 1
															? "Tomorrow!"
															: `${daysUntil} days to go`}
													</div>
												)}

												{status === "ongoing" && (
													<div className="flex items-center text-sm text-green-600">
														<svg
															className="w-4 h-4 mr-2"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>Ongoing Trip Icon</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														Currently traveling
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</Link>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default Dashboard;
