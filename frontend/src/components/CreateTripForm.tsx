import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Trip } from "@/models/trip";
import { createTrip } from "@/services/TripService";

interface CreateTripFormProps {
	onTripCreated: (trip: Trip) => void;
}

export function CreateTripForm({ onTripCreated }: CreateTripFormProps) {
	const [name, setName] = useState("");
	const [destination, setDestination] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const newTrip = await createTrip({
				name,
				destination,
				startDate,
				endDate,
			});
			onTripCreated(newTrip);
		} catch (_err) {
			setError(`An error occurred while creating the trip. Please try again.`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="destination">Destination</Label>
				<Input
					id="destination"
					value={destination}
					onChange={(e) => setDestination(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="startDate">Start Date</Label>
				<Input
					id="startDate"
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="endDate">End Date</Label>
				<Input
					id="endDate"
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					required
				/>
			</div>
			<Button type="submit">Create Trip</Button>
			{error && <p className="text-red-500">{error}</p>}
		</form>
	);
}
