import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreateTripForm } from "@/components/CreateTripForm";
import { Button } from "@/components/ui/button";
import type { Trip } from "@/models/trip";
import { getTrips } from "@/services/TripService";

const Dashboard = () => {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [showCreateForm, setShowCreateForm] = useState(false);

	useEffect(() => {
		const fetchTrips = async () => {
			const trips = await getTrips();
			setTrips(trips);
		};

		fetchTrips();
	}, []);

	const handleTripCreated = (newTrip: Trip) => {
		setTrips([...trips, newTrip]);
		setShowCreateForm(false);
	};

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Your Trips</h1>
				<Button onClick={() => setShowCreateForm(!showCreateForm)}>
					{showCreateForm ? "Cancel" : "Create Trip"}
				</Button>
			</div>

			{showCreateForm && <CreateTripForm onTripCreated={handleTripCreated} />}

			<ul className="mt-4">
				{trips.map((trip) => (
					<li key={trip.tripId} className="p-4 border-b">
						<Link to={`/trip/${trip.tripId}`}>
							<h2 className="text-xl font-semibold">{trip.name}</h2>
							<p>{trip.destination}</p>
							<p>
								{new Date(trip.startDate).toLocaleDateString()} -{" "}
								{new Date(trip.endDate).toLocaleDateString()}
							</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Dashboard;
