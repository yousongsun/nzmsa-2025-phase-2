import { useState } from "react";
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
import type { SharedTrip } from "@/models/shared-trip";
import { PermissionLevel } from "@/models/shared-trip";
import { shareTrip } from "@/services/SharedTripService";

interface ShareTripDialogProps {
	tripId: number;
	tripName: string;
	onSharedTripCreated: (sharedTrip: SharedTrip) => void;
	trigger?: React.ReactNode;
}

export function ShareTripDialog({
	tripId,
	tripName,
	onSharedTripCreated,
	trigger,
}: ShareTripDialogProps) {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>(
		PermissionLevel.View,
	);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			// Validate email format
			if (!email.trim()) {
				throw new Error("Please enter an email address");
			}

			if (!/\S+@\S+\.\S+/.test(email.trim())) {
				throw new Error("Please enter a valid email address");
			}

			const result = await shareTrip(tripId, {
				email: email.trim(),
				permissionLevel,
			});

			if (result && "sharedTripId" in result) {
				onSharedTripCreated(result);
			}

			setSuccess(true);
			setEmail("");
			setPermissionLevel(PermissionLevel.View);

			// Close dialog after success
			setTimeout(() => {
				setOpen(false);
				setSuccess(false);
			}, 1500);
		} catch (err: any) {
			const message =
				err.response?.data?.message ||
				err.message ||
				"An error occurred while sharing the trip. Please try again";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			// Reset form when dialog closes
			setEmail("");
			setPermissionLevel(PermissionLevel.View);
			setError("");
			setSuccess(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || <Button variant="outline">Share Trip</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Share "{tripName}"</DialogTitle>
					<DialogDescription>
						Enter the email address of the person you'd like to share this trip
						with.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="share-email">Email Address</Label>
						<Input
							id="share-email"
							type="email"
							placeholder="friend@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
							className={error ? "border-red-500" : ""}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="permission-level">Permission Level</Label>
						<Select
							value={permissionLevel}
							onValueChange={(value: PermissionLevel) =>
								setPermissionLevel(value)
							}
							disabled={loading}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select permission level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={PermissionLevel.View}>
									<div className="flex flex-col items-start">
										<span className="font-medium">View Only</span>
										<span className="text-xs text-gray-500">
											Can view trip details and itinerary
										</span>
									</div>
								</SelectItem>
								<SelectItem value={PermissionLevel.Edit}>
									<div className="flex flex-col items-start">
										<span className="font-medium">Edit Access</span>
										<span className="text-xs text-gray-500">
											Can view and modify trip details
										</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{error && (
						<div className="p-3 rounded-md bg-red-50 border border-red-200">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					{success && (
						<div className="p-3 rounded-md bg-green-50 border border-green-200">
							<p className="text-sm text-green-600">
								✓ Trip shared successfully!
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
						<Button type="submit" disabled={loading || !email.trim()}>
							{loading ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Sharing...</span>
								</div>
							) : (
								"Share Trip"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

// Legacy component for backward compatibility
export function ShareTripForm({
	tripId,
	onSharedTripCreated,
}: {
	tripId: number;
	onSharedTripCreated: (sharedTrip: SharedTrip) => void;
}) {
	return (
		<ShareTripDialog
			tripId={tripId}
			tripName="Trip"
			onSharedTripCreated={onSharedTripCreated}
		/>
	);
}
