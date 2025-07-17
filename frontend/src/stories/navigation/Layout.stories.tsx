import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Navigation/Layout";
import { store } from "@/redux/store";

const meta = {
	title: "Navigation/Layout",
	component: Layout,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<Provider store={store}>
				<BrowserRouter>
					<div style={{ height: "100vh" }}>
						<Story />
					</div>
				</BrowserRouter>
			</Provider>
		),
	],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithCustomClass: Story = {
	args: {
		className: "bg-gray-100",
	},
};
