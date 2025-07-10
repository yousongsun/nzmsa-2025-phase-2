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
import type { Trip } from "@/models/trip";
import { createTrip } from "@/services/TripService";

interface CreateTripDialogProps {
	onTripCreated: (trip: Trip) => void;
	trigger?: React.ReactNode;
}

export function CreateTripDialog({
	onTripCreated,
	trigger,
}: CreateTripDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [destination, setDestination] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [latitude, setLatitude] = useState<number | undefined>();
	const [longitude, setLongitude] = useState<number | undefined>();
	const [address, setAddress] = useState("");
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
		setName("");
		setDestination("");
		setStartDate("");
		setEndDate("");
		setLatitude(undefined);
		setLongitude(undefined);
		setAddress("");
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
			const newTrip = await createTrip({
				name: name.trim(),
				destination: destination.trim(),
				startDate,
				endDate,
				latitude,
				longitude,
			});

			onTripCreated(newTrip);
			setSuccess(true);

			// Close dialog after success
			setTimeout(() => {
				setOpen(false);
				resetForm();
			}, 1500);
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"An error occurred while creating the trip. Please try again.";
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
				{trigger || (
					<Button>
						<svg
							className="w-4 h-4 mr-2"
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
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create New Trip</DialogTitle>
					<DialogDescription>
						Plan your next adventure by creating a new trip with all the
						details.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="trip-name">Trip Name *</Label>
							<Input
								id="trip-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={loading}
								placeholder="Summer Vacation 2024"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="destination">Destination *</Label>
							<Input
								id="destination"
								value={destination}
								onChange={(e) => setDestination(e.target.value)}
								disabled={loading}
								placeholder="Paris, France"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="start-date">Start Date *</Label>
							<Input
								id="start-date"
								type="date"
								value={startDate}
								onChange={(e) => handleStartDateChange(e.target.value)}
								disabled={loading}
								className={dateError ? "border-red-500" : ""}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="end-date">End Date *</Label>
							<Input
								id="end-date"
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
							Add a location to see your trip on the map
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
								✓ Trip created successfully!
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
									<span>Creating...</span>
								</div>
							) : (
								"Create Trip"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// Legacy component for backward compatibility
export function CreateTripForm({
	onTripCreated,
}: {
	onTripCreated: (trip: Trip) => void;
}) {
	return <CreateTripDialog onTripCreated={onTripCreated} />;
}
