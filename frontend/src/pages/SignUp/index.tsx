import { SignUpForm } from "@/components/SignupForm";

const SignUp: React.FC = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background px-4">
			<div className="w-full max-w-md">
				<SignUpForm />
			</div>
		</div>
	);
};

export default SignUp;
