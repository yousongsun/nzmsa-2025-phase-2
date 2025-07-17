import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { EditPostDialog } from "@/components/EditPostForm";
import type { Post } from "@/models/post";
import { PostPrivacy } from "@/models/post";
import { store } from "@/redux/store";

const mockPost: Post = {
	id: 1,
	content: "This is a sample post content that can be edited.",
	imageUrl: null,
	imageAltText: null,
	privacy: PostPrivacy.PUBLIC,
	userId: 1,
	user: {
		id: 1,
		email: "user@example.com",
		name: "John Doe",
		profilePicture: null,
		bio: "Sample bio",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	createdAt: "2024-07-01T00:00:00Z",
	updatedAt: "2024-07-01T00:00:00Z",
	likesCount: 5,
	commentsCount: 2,
	isLiked: false,
};

const meta = {
	title: "Components/EditPostForm",
	component: EditPostDialog,
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
		onPostUpdated: { action: "post updated" },
	},
} satisfies Meta<typeof EditPostDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		post: mockPost,
		onPostUpdated: (post: Post) => console.log("Post updated:", post),
		trigger: <button type="button">Edit Post</button>,
	},
};

export const WithoutTrigger: Story = {
	args: {
		post: mockPost,
		onPostUpdated: (post: Post) => console.log("Post updated:", post),
	},
};
