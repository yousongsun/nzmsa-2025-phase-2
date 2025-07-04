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
import type { SharedTrip } from "@/models/shared-trip";
import { PermissionLevel } from "@/models/shared-trip";
import { createSharedTrip } from "@/services/SharedTripService";
import { getUserByEmail } from "@/services/UserService";

interface ShareTripFormProps {
	tripId: number;
	onSharedTripCreated: (sharedTrip: SharedTrip) => void;
}

export function ShareTripForm({
	tripId,
	onSharedTripCreated,
}: ShareTripFormProps) {
	const [email, setEmail] = useState("");
	const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>(
		PermissionLevel.View,
	);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const user = await getUserByEmail(email);
			const newSharedTrip = await createSharedTrip(tripId, {
				userId: user.userId,
				permissionLevel,
			});
			onSharedTripCreated(newSharedTrip);
		} catch (_err) {
			setError(`An error occurred while sharing the trip. Please try again`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
				<Label htmlFor="permissionLevel">Permission Level</Label>
				<Select
					onValueChange={(value: string) =>
						setPermissionLevel(value as PermissionLevel)
					}
					defaultValue={permissionLevel}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a permission level" />
					</SelectTrigger>
					<SelectContent>
						{Object.values(PermissionLevel).map((level) => (
							<SelectItem key={level} value={level}>
								{level}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Button type="submit">Share Trip</Button>
			{error && <p className="text-red-500">{error}</p>}
		</form>
	);
}
