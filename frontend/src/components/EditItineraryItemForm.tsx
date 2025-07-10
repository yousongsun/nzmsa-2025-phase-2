import { useState } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { updateItineraryItem } from "@/services/ItineraryItemService";

interface EditItineraryItemDialogProps {
	tripId: number;
	item: ItineraryItem;
	onItineraryItemUpdated: (item: ItineraryItem) => void;
	trigger?: React.ReactNode;
}

export function EditItineraryItemDialog({
	tripId,
	item,
	onItineraryItemUpdated,
	trigger,
}: EditItineraryItemDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(item.name);
	const [type, setType] = useState<ItineraryItemType>(item.type);
	const [startTime, setStartTime] = useState(item.startTime);
	const [endTime, setEndTime] = useState(item.endTime);
	const [latitude, setLatitude] = useState<number | undefined>(item.latitude);
	const [longitude, setLongitude] = useState<number | undefined>(
		item.longitude,
	);
	const [address, setAddress] = useState(item.address ?? "");
	const [error, setError] = useState("");
	const [timeError, setTimeError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const validateTimes = (start: string, end: string) => {
		if (start && end) {
			const startDate = new Date(start);
			const endDate = new Date(end);
			if (startDate >= endDate) {
				setTimeError("Start time must be earlier than end time");
				return false;
			}
		}
		setTimeError("");
		return true;
	};

	const handleStartTimeChange = (value: string) => {
		setStartTime(value);
		validateTimes(value, endTime);
	};

	const handleEndTimeChange = (value: string) => {
		setEndTime(value);
		validateTimes(startTime, value);
	};

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

	const resetForm = () => {
		setName(item.name);
		setType(item.type);
		setStartTime(item.startTime);
		setEndTime(item.endTime);
		setLatitude(item.latitude);
		setLongitude(item.longitude);
		setAddress(item.address ?? "");
		setError("");
		setTimeError("");
		setSuccess(false);
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			resetForm();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!validateTimes(startTime, endTime)) {
			return;
		}

		setLoading(true);
		try {
			const updatedItem: ItineraryItem = {
				...item,
				name,
				type,
				startTime,
				endTime,
				latitude,
				longitude,
				address,
				tripId,
			};
			await updateItineraryItem(tripId, updatedItem);
			onItineraryItemUpdated(updatedItem);
			setSuccess(true);
			setTimeout(() => {
				setOpen(false);
				setSuccess(false);
			}, 1500);
		} catch (_err) {
			setError(
				"An error occurred while updating the itinerary item. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	const isFormValid = name.trim() && startTime && endTime && !timeError;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || <Button variant="ghost">Edit</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Itinerary Item</DialogTitle>
					<DialogDescription>
						Modify details of this itinerary item.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="edit-item-name">Name</Label>
						<Input
							id="edit-item-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					<div>
						<Label htmlFor="edit-item-type">Type</Label>
						<Select
							onValueChange={(value: string) =>
								setType(value as ItineraryItemType)
							}
							value={type}
							disabled={loading}
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
						<Label htmlFor="edit-item-start">Start Time</Label>
						<Input
							id="edit-item-start"
							type="datetime-local"
							value={startTime}
							onChange={(e) => handleStartTimeChange(e.target.value)}
							required
							disabled={loading}
							className={timeError ? "border-red-500" : ""}
						/>
					</div>
					<div>
						<Label htmlFor="edit-item-end">End Time</Label>
						<Input
							id="edit-item-end"
							type="datetime-local"
							value={endTime}
							onChange={(e) => handleEndTimeChange(e.target.value)}
							required
							disabled={loading}
							className={timeError ? "border-red-500" : ""}
						/>
						{timeError && (
							<p className="text-red-500 text-sm mt-1">{timeError}</p>
						)}
					</div>
					<div>
						<Label>Location (Optional)</Label>
						<p className="text-sm text-gray-600 mb-2">
							Add or update a location for map display
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
					{error && <p className="text-red-500">{error}</p>}
					{success && <p className="text-green-600">✓ Item updated!</p>}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading || !isFormValid}>
							{loading ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Saving...</span>
								</div>
							) : (
								"Save"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
