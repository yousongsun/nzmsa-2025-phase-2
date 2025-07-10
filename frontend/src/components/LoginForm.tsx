import axios from "axios";
import { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/selector/authSelectors";
import { loginSuccess } from "@/redux/slices/authSlice";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5042";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isLoggedIn = useAppSelector(selectIsLoggedIn);

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/dashboard");
		}
	}, [isLoggedIn, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await axios.post(
				`${API_BASE_URL}/api/users/login`,
				{ email, password },
				{ withCredentials: true },
			);

			setSuccess(true);
			setEmail("");
			setPassword("");
			dispatch(loginSuccess(response.data.token));

			// Add a small delay to show success message
			setTimeout(() => {
				navigate("/dashboard");
			}, 1000);
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"An error occurred while logging in. Please try again.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="msa@nz.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
								className={error ? "border-red-500" : ""}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
							</div>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
								className={error ? "border-red-500" : ""}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={loading || !email || !password}
						>
							{loading ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Signing in...</span>
								</div>
							) : (
								"Sign in"
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
									✓ Logged in successfully! Redirecting...
								</p>
							</div>
						)}

						<div className="text-center">
							<p className="text-sm text-gray-600">
								Don't have an account?{" "}
								<a
									href="/signup"
									className="font-medium underline underline-offset-4"
								>
									Sign up
								</a>
							</p>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
