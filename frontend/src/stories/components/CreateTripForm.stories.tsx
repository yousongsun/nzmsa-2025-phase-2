import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CreateTripDialog } from "@/components/CreateTripForm";
import { store } from "@/redux/store";

const meta = {
	title: "Components/CreateTripForm",
	component: CreateTripDialog,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<Provider store={store}>
				<BrowserRouter>
					<Story />
				</BrowserRouter>
			</Provider>
		),
	],
	argTypes: {
		onTripCreated: { action: "trip created" },
	},
} satisfies Meta<typeof CreateTripDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onTripCreated: () => {},
		trigger: <button type="button">Create Trip</button>,
	},
};

export const WithoutTrigger: Story = {
	args: {
		onTripCreated: () => {},
	},
};
