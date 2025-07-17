import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { SignUpForm } from "@/components/SignupForm";

const meta = {
	title: "Components/SignupForm",
	component: SignUpForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<MemoryRouter>
			<SignUpForm />
		</MemoryRouter>
	),
};
export const WithContainer: Story = {
	render: () => (
		<MemoryRouter>
			<div className="w-full max-w-md mx-auto p-6 bg-card border rounded-lg shadow-sm">
				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold">Create Account</h1>
					<p className="text-muted-foreground">
						Join us to start your travel journey
					</p>
				</div>
				<SignUpForm />
			</div>
		</MemoryRouter>
	),
};

export const InPage: Story = {
	render: () => (
		<MemoryRouter>
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold">Travel Journal</h1>
						<p className="text-muted-foreground mt-2">
							Create your account to get started
						</p>
					</div>
					<div className="bg-card border rounded-lg shadow-sm p-6">
						<SignUpForm />
					</div>
					<p className="text-center text-sm text-muted-foreground mt-4">
						Already have an account?{" "}
						<a href="/login" className="text-primary hover:underline">
							Sign in here
						</a>
					</p>
				</div>
			</div>
		</MemoryRouter>
	),
	parameters: {
		layout: "fullscreen",
	},
};
