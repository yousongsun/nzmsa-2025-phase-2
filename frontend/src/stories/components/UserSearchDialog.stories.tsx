import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { UserSearchDialog } from "@/components/UserSearchDialog";
import { store } from "@/redux/store";

const meta = {
	title: "Components/UserSearchDialog",
	component: UserSearchDialog,
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
} satisfies Meta<typeof UserSearchDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		trigger: <button type="button">Search Users</button>,
	},
};

export const WithoutTrigger: Story = {
	args: {},
};
