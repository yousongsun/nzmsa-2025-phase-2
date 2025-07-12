import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUserId } from "@/lib/auth";
import type { User } from "@/models/user";
import { getUserById, updateUser } from "@/services/UserService";

const Settings = () => {
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		description: "",
	});
	const [loading, setLoading] = useState(true);
	const currentUserId = getCurrentUserId();
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			if (!currentUserId) return;
			try {
				const user = await getUserById(currentUserId);
				setForm({
					firstName: user.firstName,
					lastName: user.lastName,
					description: user.description || "",
				});
			} catch (err) {
				console.error("Failed to load user:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [currentUserId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentUserId) return;
		setSaving(true);
		try {
			await updateUser({
				userId: currentUserId,
				email: "", // email is not editable here
				firstName: form.firstName,
				lastName: form.lastName,
				description: form.description,
			} as User);
		} catch (err) {
			console.error("Failed to update user:", err);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="p-4">Loading settings...</div>;
	}

	return (
		<div className="max-w-xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>Account Settings</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								value={form.firstName}
								onChange={(e) =>
									setForm({ ...form, firstName: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								value={form.lastName}
								onChange={(e) => setForm({ ...form, lastName: e.target.value })}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								value={form.description}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
						</div>
						<Button type="submit" disabled={saving}>
							{saving ? "Saving..." : "Save"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Settings;
