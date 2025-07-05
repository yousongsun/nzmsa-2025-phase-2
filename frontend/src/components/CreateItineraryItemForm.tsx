import { useState } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ItineraryItem } from "@/models/itinerary-item";
import { ItineraryItemType } from "@/models/itinerary-item";
import { createItineraryItem } from "@/services/ItineraryItemService";

interface CreateItineraryItemFormProps {
	tripId: number;
	onItineraryItemCreated: (itineraryItem: ItineraryItem) => void;
}

export function CreateItineraryItemForm({
	tripId,
	onItineraryItemCreated,
}: CreateItineraryItemFormProps) {
	const [name, setName] = useState("");
	const [type, setType] = useState<ItineraryItemType>(
		ItineraryItemType.Activity,
	);
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [latitude, setLatitude] = useState<number | undefined>();
	const [longitude, setLongitude] = useState<number | undefined>();
	const [address, setAddress] = useState("");
	const [error, setError] = useState("");

	const handleLocationChange = (location: {
		latitude: number;
		longitude: number;
		address?: string;
	}) => {
		setLatitude(location.latitude);
		setLongitude(location.longitude);
		if (location.address) {
			setAddress(location.address);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const newItineraryItem = await createItineraryItem(tripId, {
				name,
				type,
				startTime,
				endTime,
				latitude,
				longitude,
				address,
			});
			onItineraryItemCreated(newItineraryItem);
		} catch (_err) {
			setError(
				"An error occurred while creating the itinerary item. Please try again.",
			);
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
				<Label htmlFor="type">Type</Label>
				<Select
					onValueChange={(value: string) => setType(value as ItineraryItemType)}
					defaultValue={type}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a type" />
					</SelectTrigger>
					<SelectContent>
						{Object.values(ItineraryItemType).map((itemType) => (
							<SelectItem key={itemType} value={itemType}>
								{itemType}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label htmlFor="startTime">Start Time</Label>
				<Input
					id="startTime"
					type="datetime-local"
					value={startTime}
					onChange={(e) => setStartTime(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="endTime">End Time</Label>
				<Input
					id="endTime"
					type="datetime-local"
					value={endTime}
					onChange={(e) => setEndTime(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label>Location (Optional)</Label>
				<p className="text-sm text-gray-600 mb-2">
					Add a location to see this item on the map
				</p>
				<LocationPicker
					latitude={latitude}
					longitude={longitude}
					address={address}
					onLocationChange={handleLocationChange}
					onAddressChange={setAddress}
					className="h-64 w-full rounded-lg"
				/>
			</div>
			<Button type="submit">Create Itinerary Item</Button>
			{error && <p className="text-red-500">{error}</p>}
		</form>
	);
}
