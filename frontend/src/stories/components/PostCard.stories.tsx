import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/models/post";
import { PostPrivacy } from "@/models/post";
import { store } from "@/redux/store";

const meta = {
	title: "Components/PostCard",
	component: PostCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		onPostDeleted: { action: "post deleted" },
	},
	decorators: [
		(Story) => {
			return (
				<Provider store={store}>
					<BrowserRouter>
						<Story />
					</BrowserRouter>
				</Provider>
			);
		},
	],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost: Post = {
	postId: 1,
	content:
		"Just visited the most amazing beach in Bali! The sunset was absolutely breathtaking. Can't wait to go back! 🌅🏖️",
	imageUrl:
		"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
	imageAltText: "Beautiful sunset at Bali beach",
	createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
	privacy: PostPrivacy.Public,
	userId: 1,
	userFirstName: "John",
	userLastName: "Doe",
	userProfilePicture: "https://github.com/shadcn.png",
	tripId: 1,
	tripName: "Bali Adventure",
	tripDestination: "Bali, Indonesia",
	likeCount: 24,
	commentCount: 5,
	likes: [],
	comments: [],
};

const mockPostWithoutImage: Post = {
	...mockPost,
	postId: 2,
	content:
		"Exploring the local markets today. The variety of spices and fresh produce is incredible! Learning so much about the local culture.",
	imageUrl: undefined,
	imageAltText: undefined,
	likeCount: 12,
	commentCount: 3,
};

const mockPostPrivate: Post = {
	...mockPost,
	postId: 3,
	content:
		"Personal reflection on my journey so far. This trip has been life-changing in ways I never expected.",
	privacy: PostPrivacy.Private,
	likeCount: 8,
	commentCount: 2,
	imageUrl: undefined,
	imageAltText: undefined,
};

const mockPostFollowersOnly: Post = {
	...mockPost,
	postId: 4,
	content:
		"Sharing some behind-the-scenes moments from today's adventure with my close friends!",
	privacy: PostPrivacy.FollowersOnly,
	likeCount: 15,
	commentCount: 7,
};

export const Default: Story = {
	args: {
		post: mockPost,
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const WithoutImage: Story = {
	args: {
		post: mockPostWithoutImage,
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const PrivatePost: Story = {
	args: {
		post: mockPostPrivate,
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const FollowersOnlyPost: Story = {
	args: {
		post: mockPostFollowersOnly,
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const LongContent: Story = {
	args: {
		post: {
			...mockPost,
			postId: 5,
			content:
				"What an incredible day! Started early with a sunrise hike to the volcano, then spent the afternoon exploring the traditional villages. The locals were so welcoming and shared amazing stories about their culture and traditions. The food was absolutely delicious - every meal was a new adventure for my taste buds. Tomorrow we're planning to visit the ancient temples and maybe try some water sports. This trip is exceeding all my expectations and I'm learning so much about myself and the world. Can't believe I almost didn't book this adventure!",
			likeCount: 45,
			commentCount: 12,
		},
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const RecentPost: Story = {
	args: {
		post: {
			...mockPost,
			postId: 6,
			createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
			content: "Just posted this amazing view! 📸✨",
			likeCount: 3,
			commentCount: 1,
		},
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const OldPost: Story = {
	args: {
		post: {
			...mockPost,
			postId: 7,
			createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
			content: "Throwback to this amazing adventure from last month!",
			likeCount: 89,
			commentCount: 23,
		},
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const WithoutTrip: Story = {
	args: {
		post: {
			...mockPost,
			postId: 8,
			tripId: undefined,
			tripName: undefined,
			tripDestination: undefined,
			content: "Just a random thought I wanted to share with everyone today.",
			imageUrl: undefined,
			imageAltText: undefined,
			likeCount: 6,
			commentCount: 2,
		},
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const HighEngagement: Story = {
	args: {
		post: {
			...mockPost,
			postId: 9,
			content:
				"This photo went viral! Thanks everyone for the amazing response 🙏",
			likeCount: 247,
			commentCount: 56,
		},
		onPostDeleted: (postId: number) => console.log("Post deleted:", postId),
	},
};

export const MultiplePosts: Story = {
	args: {
		post: mockPost,
		onPostDeleted: (id: number) => console.log("Deleted:", id),
	},
	render: (args) => (
		<div className="space-y-4 max-w-2xl">
			<PostCard {...args} />
			<PostCard
				post={mockPostWithoutImage}
				onPostDeleted={(id) => console.log("Deleted:", id)}
			/>
			<PostCard
				post={mockPostPrivate}
				onPostDeleted={(id) => console.log("Deleted:", id)}
			/>
		</div>
	),
	parameters: {
		layout: "padded",
	},
};
