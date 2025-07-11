import { useEffect, useState } from "react";
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
import type { Trip } from "@/models/trip";
import { updateTrip } from "@/services/TripService";

interface EditTripDialogProps {
	trip: Trip;
	onTripUpdated: (trip: Trip) => void;
	trigger?: React.ReactNode;
}

export function EditTripDialog({
	trip,
	onTripUpdated,
	trigger,
}: EditTripDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(trip.name);
	const [destination, setDestination] = useState(trip.destination);
	const formatDate = (d: string) => d.split("T")[0];
	const [startDate, setStartDate] = useState(formatDate(trip.startDate));
	const [endDate, setEndDate] = useState(formatDate(trip.endDate));
	const [latitude, setLatitude] = useState<number | undefined>(trip.latitude);
	const [longitude, setLongitude] = useState<number | undefined>(
		trip.longitude,
	);
	const [address, setAddress] = useState("");

	// Fetch address based on coordinates
	const loadAddress = async (lat?: number, lon?: number) => {
		if (lat != null && lon != null) {
			try {
				const res = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
				);
				const data = await res.json();
				if (data?.display_name) {
					setAddress(data.display_name);
					return;
				}
			} catch (err) {
				console.error("Failed to reverse geocode", err);
			}
		}
		setAddress("");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to load the address whenever latitude or longitude changes
	useEffect(() => {
		loadAddress(latitude, longitude);
	}, [latitude, longitude]);
	const [error, setError] = useState("");
	const [dateError, setDateError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const validateDates = (start: string, end: string) => {
		if (start && end) {
			const startD = new Date(start);
			const endD = new Date(end);
			if (startD > endD) {
				setDateError("Start date cannot be later than end date");
				return false;
			}
		}
		setDateError("");
		return true;
	};

	const handleStartDateChange = (value: string) => {
		setStartDate(value);
		validateDates(value, endDate);
	};

	const handleEndDateChange = (value: string) => {
		setEndDate(value);
		validateDates(startDate, value);
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
		setName(trip.name);
		setDestination(trip.destination);
		setStartDate(formatDate(trip.startDate));
		setEndDate(formatDate(trip.endDate));
		setLatitude(trip.latitude);
		setLongitude(trip.longitude);
		loadAddress(trip.latitude, trip.longitude);
		setError("");
		setDateError("");
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

		if (!validateDates(startDate, endDate)) {
			return;
		}

		setLoading(true);
		try {
			const updatedTrip: Trip = {
				...trip,
				name: name.trim(),
				destination: destination.trim(),
				startDate,
				endDate,
				latitude,
				longitude,
			};
			await updateTrip(updatedTrip);
			onTripUpdated(updatedTrip);
			setSuccess(true);
			setTimeout(() => {
				setOpen(false);
				setSuccess(false);
			}, 1500);
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"An error occurred while updating the trip. Please try again.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const isFormValid =
		name.trim() && destination.trim() && startDate && endDate && !dateError;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || <Button variant="outline">Edit Trip</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Trip</DialogTitle>
					<DialogDescription>Update your trip details.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="edit-trip-name">Trip Name *</Label>
							<Input
								id="edit-trip-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={loading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-destination">Destination *</Label>
							<Input
								id="edit-destination"
								value={destination}
								onChange={(e) => setDestination(e.target.value)}
								disabled={loading}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="edit-start-date">Start Date *</Label>
							<Input
								id="edit-start-date"
								type="date"
								value={startDate}
								onChange={(e) => handleStartDateChange(e.target.value)}
								disabled={loading}
								className={dateError ? "border-red-500" : ""}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-end-date">End Date *</Label>
							<Input
								id="edit-end-date"
								type="date"
								value={endDate}
								onChange={(e) => handleEndDateChange(e.target.value)}
								disabled={loading}
								className={dateError ? "border-red-500" : ""}
							/>
							{dateError && <p className="text-xs text-red-600">{dateError}</p>}
						</div>
					</div>
					<div className="space-y-2">
						<Label>Trip Location (Optional)</Label>
						<p className="text-sm text-gray-600">
							Update the location used on the map
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
					{error && (
						<div className="p-3 rounded-md bg-red-50 border border-red-200">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}
					{success && (
						<div className="p-3 rounded-md bg-green-50 border border-green-200">
							<p className="text-sm text-green-600">
								✓ Trip updated successfully!
							</p>
						</div>
					)}
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
								"Save Changes"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
