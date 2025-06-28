import { LoginForm } from "@/components/login-form";

const Login: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-screen ">
			<div className="w-full max-w-md p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center mb-6">Login</h2>
				<LoginForm />
			</div>
		</div>
	);
};

export default Login;
