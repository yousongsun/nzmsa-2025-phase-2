import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PostComments } from "@/components/PostComments";
import { store } from "@/redux/store";

const meta = {
	title: "Components/PostComments",
	component: PostComments,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<Provider store={store}>
				<BrowserRouter>
					<div style={{ width: "600px", padding: "20px" }}>
						<Story />
					</div>
				</BrowserRouter>
			</Provider>
		),
	],
} satisfies Meta<typeof PostComments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		postId: 1,
	},
};

export const WithDifferentPost: Story = {
	args: {
		postId: 2,
	},
};
