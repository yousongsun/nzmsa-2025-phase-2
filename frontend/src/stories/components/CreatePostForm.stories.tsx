import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CreatePostForm } from "@/components/CreatePostForm";
import { store } from "@/redux/store";

const meta = {
	title: "Components/CreatePostForm",
	component: CreatePostForm,
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
	argTypes: {
		onPostCreated: { action: "post created" },
	},
} satisfies Meta<typeof CreatePostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onPostCreated: (success: boolean) => console.log("Post created:", success),
	},
};

export const WithoutCallback: Story = {
	args: {},
};
