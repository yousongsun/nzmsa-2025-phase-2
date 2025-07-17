import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const meta = {
	title: "UI/Select",
	component: Select,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Select>
			<SelectTrigger className="w-48">
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="option1">Option 1</SelectItem>
				<SelectItem value="option2">Option 2</SelectItem>
				<SelectItem value="option3">Option 3</SelectItem>
			</SelectContent>
		</Select>
	),
};

export const WithLabel: Story = {
	render: () => (
		<div className="space-y-2">
			<Label htmlFor="country">Country</Label>
			<Select>
				<SelectTrigger className="w-64">
					<SelectValue placeholder="Select a country" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="us">United States</SelectItem>
					<SelectItem value="ca">Canada</SelectItem>
					<SelectItem value="uk">United Kingdom</SelectItem>
					<SelectItem value="au">Australia</SelectItem>
					<SelectItem value="de">Germany</SelectItem>
					<SelectItem value="fr">France</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<Select disabled>
			<SelectTrigger className="w-48">
				<SelectValue placeholder="Disabled select" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="option1">Option 1</SelectItem>
				<SelectItem value="option2">Option 2</SelectItem>
			</SelectContent>
		</Select>
	),
};

export const WithDefaultValue: Story = {
	render: () => (
		<Select defaultValue="option2">
			<SelectTrigger className="w-48">
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="option1">Option 1</SelectItem>
				<SelectItem value="option2">Option 2 (Default)</SelectItem>
				<SelectItem value="option3">Option 3</SelectItem>
			</SelectContent>
		</Select>
	),
};

export const ManyOptions: Story = {
	render: () => (
		<Select>
			<SelectTrigger className="w-64">
				<SelectValue placeholder="Select a city" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="new-york">New York</SelectItem>
				<SelectItem value="los-angeles">Los Angeles</SelectItem>
				<SelectItem value="chicago">Chicago</SelectItem>
				<SelectItem value="houston">Houston</SelectItem>
				<SelectItem value="phoenix">Phoenix</SelectItem>
				<SelectItem value="philadelphia">Philadelphia</SelectItem>
				<SelectItem value="san-antonio">San Antonio</SelectItem>
				<SelectItem value="san-diego">San Diego</SelectItem>
				<SelectItem value="dallas">Dallas</SelectItem>
				<SelectItem value="san-jose">San Jose</SelectItem>
			</SelectContent>
		</Select>
	),
};

export const FormExample: Story = {
	render: () => (
		<div className="space-y-4 w-80">
			<div className="space-y-2">
				<Label htmlFor="category">Category</Label>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="electronics">Electronics</SelectItem>
						<SelectItem value="clothing">Clothing</SelectItem>
						<SelectItem value="books">Books</SelectItem>
						<SelectItem value="home">Home & Garden</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="priority">Priority</Label>
				<Select defaultValue="medium">
					<SelectTrigger>
						<SelectValue placeholder="Select priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="low">Low</SelectItem>
						<SelectItem value="medium">Medium</SelectItem>
						<SelectItem value="high">High</SelectItem>
						<SelectItem value="urgent">Urgent</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	),
};
