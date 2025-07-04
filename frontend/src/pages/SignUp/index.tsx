import { SignUpForm } from "@/components/SignupForm";

const SignUp: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-screen ">
			<div className="w-full max-w-md p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
				<SignUpForm />
			</div>
		</div>
	);
};

export default SignUp;
