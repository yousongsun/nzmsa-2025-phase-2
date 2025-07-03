import { useState } from "react";
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
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const newItineraryItem = await createItineraryItem(tripId, {
				name,
				type,
				startTime,
				endTime,
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
			<Button type="submit">Create Itinerary Item</Button>
			{error && <p className="text-red-500">{error}</p>}
		</form>
	);
}
