import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5042";

export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			await axios.post(
				`${API_BASE_URL}/api/users`,
				{
					firstName,
					lastName,
					email,
					password,
					description,
				},
				{ withCredentials: true },
			);
			setSuccess(true);
			setFirstName("");
			setLastName("");
			setEmail("");
			setPassword("");
			setDescription("");
		} catch (err) {
			setError(
				(err as Error).message ||
					"An error occurred while creating your account. Please try again.",
			);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>Enter your details to sign up</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="grid gap-3">
								<Label htmlFor="description">Description</Label>
								<Input
									id="description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full">
									Sign Up
								</Button>
							</div>
						</div>
						{error && <p className="mt-4 text-sm text-red-500">{error}</p>}
						{!error && success && (
							<p className="mt-4 text-sm text-green-600">
								Account created successfully
							</p>
						)}
						<div className="mt-4 text-center">
							<p className="text-sm">
								Already have an account?{" "}
								<a href="/login" className="underline underline-offset-4">
									Log in
								</a>
							</p>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
