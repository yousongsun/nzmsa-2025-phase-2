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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { SharedTrip } from "@/models/shared-trip";
import { PermissionLevel } from "@/models/shared-trip";
import { updateSharedTrip } from "@/services/SharedTripService";

interface EditSharedTripDialogProps {
	tripId: number;
	sharedTrip: SharedTrip;
	onSharedTripUpdated: (sharedTrip: SharedTrip) => void;
	trigger?: React.ReactNode;
}

export function EditSharedTripDialog({
	tripId,
	sharedTrip,
	onSharedTripUpdated,
	trigger,
}: EditSharedTripDialogProps) {
	const [open, setOpen] = useState(false);
	const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>(
		sharedTrip.permissionLevel,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const resetForm = () => {
		setPermissionLevel(sharedTrip.permissionLevel);
		setError("");
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
		setLoading(true);
		try {
			const updated: SharedTrip = { ...sharedTrip, permissionLevel };
			await updateSharedTrip(tripId, updated);
			onSharedTripUpdated(updated);
			setSuccess(true);
			setTimeout(() => {
				setOpen(false);
				setSuccess(false);
			}, 1000);
		} catch (_err) {
			setError("Failed to update permissions. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || <Button variant="ghost">Edit</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Edit Share</DialogTitle>
					<DialogDescription>
						Adjust the permission level for this user.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
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
								<SelectItem value={PermissionLevel.View}>View</SelectItem>
								<SelectItem value={PermissionLevel.Edit}>Edit</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && <p className="text-green-600 text-sm">✓ Updated</p>}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
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
