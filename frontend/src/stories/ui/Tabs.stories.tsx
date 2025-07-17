import type { Meta, StoryObj } from "@storybook/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const meta = {
	title: "UI/Tabs",
	component: Tabs,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue="tab1" className="w-96">
			<TabsList>
				<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				<TabsTrigger value="tab3">Tab 3</TabsTrigger>
			</TabsList>
			<TabsContent value="tab1" className="mt-4">
				<p>Content for Tab 1</p>
			</TabsContent>
			<TabsContent value="tab2" className="mt-4">
				<p>Content for Tab 2</p>
			</TabsContent>
			<TabsContent value="tab3" className="mt-4">
				<p>Content for Tab 3</p>
			</TabsContent>
		</Tabs>
	),
};

export const WithCards: Story = {
	render: () => (
		<Tabs defaultValue="account" className="w-96">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Make changes to your account here. Click save when you're done.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="name">Name</Label>
							<Input id="name" defaultValue="Pedro Duarte" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="username">Username</Label>
							<Input id="username" defaultValue="@peduarte" />
						</div>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>
							Change your password here. After saving, you'll be logged out.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="space-y-1">
							<Label htmlFor="current">Current password</Label>
							<Input id="current" type="password" />
						</div>
						<div className="space-y-1">
							<Label htmlFor="new">New password</Label>
							<Input id="new" type="password" />
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	),
};

export const DisabledTab: Story = {
	render: () => (
		<Tabs defaultValue="available" className="w-96">
			<TabsList>
				<TabsTrigger value="available">Available</TabsTrigger>
				<TabsTrigger value="disabled" disabled>
					Disabled
				</TabsTrigger>
				<TabsTrigger value="coming-soon">Coming Soon</TabsTrigger>
			</TabsList>
			<TabsContent value="available" className="mt-4">
				<p>This tab is available and can be selected.</p>
			</TabsContent>
			<TabsContent value="coming-soon" className="mt-4">
				<p>This feature is coming soon!</p>
			</TabsContent>
		</Tabs>
	),
};

export const ManyTabs: Story = {
	render: () => (
		<Tabs defaultValue="home" className="w-full max-w-4xl">
			<TabsList>
				<TabsTrigger value="home">Home</TabsTrigger>
				<TabsTrigger value="about">About</TabsTrigger>
				<TabsTrigger value="services">Services</TabsTrigger>
				<TabsTrigger value="portfolio">Portfolio</TabsTrigger>
				<TabsTrigger value="contact">Contact</TabsTrigger>
				<TabsTrigger value="blog">Blog</TabsTrigger>
			</TabsList>
			<TabsContent value="home" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Welcome Home</CardTitle>
						<CardDescription>This is the home page content.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Welcome to our website! This is the main landing page.</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="about" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>About Us</CardTitle>
						<CardDescription>Learn more about our company.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Information about our company and mission.</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="services" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Our Services</CardTitle>
						<CardDescription>What we offer to our clients.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Details about our services and offerings.</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="portfolio" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Portfolio</CardTitle>
						<CardDescription>Examples of our work.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Showcase of our previous projects and achievements.</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="contact" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Contact Us</CardTitle>
						<CardDescription>Get in touch with our team.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Contact information and contact form.</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="blog" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Blog</CardTitle>
						<CardDescription>Latest news and updates.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Recent blog posts and articles.</p>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	),
};
