import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { LoginForm } from "@/components/LoginForm";
import { store } from "@/redux/store";

const meta = {
	title: "Components/LoginForm",
	component: LoginForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Provider store={store}>
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		</Provider>
	),
};

export const WithContainer: Story = {
	render: () => (
		<Provider store={store}>
			<MemoryRouter>
				<div className="w-full max-w-md mx-auto p-6 bg-card border rounded-lg shadow-sm">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-bold">Welcome Back</h1>
						<p className="text-muted-foreground">Sign in to your account</p>
					</div>
					<LoginForm />
				</div>
			</MemoryRouter>
		</Provider>
	),
};

export const InPage: Story = {
	render: () => (
		<Provider store={store}>
			<MemoryRouter>
				<div className="min-h-screen bg-background flex items-center justify-center p-4">
					<div className="w-full max-w-md">
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold">Travel Journal</h1>
							<p className="text-muted-foreground mt-2">
								Sign in to continue your journey
							</p>
						</div>
						<div className="bg-card border rounded-lg shadow-sm p-6">
							<LoginForm />
						</div>
						<p className="text-center text-sm text-muted-foreground mt-4">
							Don't have an account?{" "}
							<a href="/signup" className="text-primary hover:underline">
								Sign up here
							</a>
						</p>
					</div>
				</div>
			</MemoryRouter>
		</Provider>
	),
	parameters: {
		layout: "fullscreen",
	},
};
