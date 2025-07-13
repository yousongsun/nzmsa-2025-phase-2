import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { register } from "@/services/AuthService";

export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});
	const navigate = useNavigate();

	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!firstName.trim()) errors.firstName = "First name is required";
		if (!lastName.trim()) errors.lastName = "Last name is required";
		if (!email.trim()) errors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";

		if (!password) errors.password = "Password is required";
		else if (password.length < 6)
			errors.password = "Password must be at least 6 characters";

		if (!confirmPassword)
			errors.confirmPassword = "Please confirm your password";
		else if (password !== confirmPassword)
			errors.confirmPassword = "Passwords do not match";

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			await register({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				password,
				description: description.trim(),
			});

			setSuccess(true);
			setFirstName("");
			setLastName("");
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setDescription("");

			// Redirect to login after successful signup
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (err: unknown) {
			const errorMessage =
				(err as any).response?.data?.message ||
				(err as any).message ||
				"An error occurred while creating your account. Please try again.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const isFormValid =
		firstName.trim() &&
		lastName.trim() &&
		email.trim() &&
		password &&
		confirmPassword &&
		Object.keys(validationErrors).length === 0;

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Create an account</CardTitle>
					<CardDescription>Enter your details to get started</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name *</Label>
								<Input
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									disabled={loading}
									className={validationErrors.firstName ? "border-red-500" : ""}
									placeholder="John"
								/>
								{validationErrors.firstName && (
									<p className="text-xs text-red-600">
										{validationErrors.firstName}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name *</Label>
								<Input
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									disabled={loading}
									className={validationErrors.lastName ? "border-red-500" : ""}
									placeholder="Doe"
								/>
								{validationErrors.lastName && (
									<p className="text-xs text-red-600">
										{validationErrors.lastName}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
								className={validationErrors.email ? "border-red-500" : ""}
								placeholder="john.doe@example.com"
							/>
							{validationErrors.email && (
								<p className="text-xs text-red-600">{validationErrors.email}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
								className={validationErrors.password ? "border-red-500" : ""}
								placeholder="Minimum 6 characters"
							/>
							{validationErrors.password && (
								<p className="text-xs text-red-600">
									{validationErrors.password}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password *</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								disabled={loading}
								className={
									validationErrors.confirmPassword ? "border-red-500" : ""
								}
								placeholder="Confirm your password"
							/>
							{validationErrors.confirmPassword && (
								<p className="text-xs text-red-600">
									{validationErrors.confirmPassword}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">About You</Label>
							<Input
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								disabled={loading}
								placeholder="Tell us a bit about yourself (optional)"
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={loading || !isFormValid}
						>
							{loading ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Creating account...</span>
								</div>
							) : (
								"Create Account"
							)}
						</Button>

						{error && (
							<div className="p-3 rounded-md bg-red-50 border border-red-200">
								<p className="text-sm text-red-600 text-center">{error}</p>
							</div>
						)}

						{success && (
							<div className="p-3 rounded-md bg-green-50 border border-green-200">
								<p className="text-sm text-green-600 text-center">
									✓ Account created successfully! Redirecting to login...
								</p>
							</div>
						)}

						<div className="text-center">
							<p className="text-sm text-gray-600">
								Already have an account?{" "}
								<a
									href="/login"
									className="font-medium underline underline-offset-4"
								>
									Sign in
								</a>
							</p>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
