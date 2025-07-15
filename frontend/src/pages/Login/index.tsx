import { LoginForm } from "@/components/LoginForm";

const Login: React.FC = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background px-4">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
};

export default Login;
