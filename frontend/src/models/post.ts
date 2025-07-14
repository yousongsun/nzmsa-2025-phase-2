// Removed unused imports - user and trip info is now flattened in DTOs

export interface Post {
	postId: number;
	content: string;
	imageUrl?: string;
	imageAltText?: string;
	createdAt: string;
	updatedAt?: string;
	privacy: PostPrivacy;
	userId: number;
	// Flattened user info (from DTO)
	userFirstName?: string;
	userLastName?: string;
	userProfilePicture?: string;
	// Flattened trip info (from DTO)
	tripId?: number;
	tripName?: string;
	tripDestination?: string;
	// Simple counts
	likeCount: number;
	commentCount: number;
	// Simple lists without circular references
	likes: PostLike[];
	comments: PostComment[];
}

export const PostPrivacy = {
	Public: 0,
	FollowersOnly: 1,
	Private: 2,
} as const;

export type PostPrivacy = (typeof PostPrivacy)[keyof typeof PostPrivacy];

export interface PostLike {
	postLikeId: number;
	postId: number;
	userId: number;
	// Flattened user info (from DTO)
	userFirstName?: string;
	userLastName?: string;
	userProfilePicture?: string;
	createdAt: string;
}

export interface PostComment {
	postCommentId: number;
	content: string;
	createdAt: string;
	updatedAt?: string;
	postId: number;
	userId: number;
	// Flattened user info (from DTO)
	userFirstName?: string;
	userLastName?: string;
	userProfilePicture?: string;
}

export interface CreatePostRequest {
	content: string;
	image?: File;
	imageAltText?: string;
	tripId?: number;
	privacy?: PostPrivacy;
}

export interface UpdatePostRequest {
	content?: string;
	image?: File;
	imageAltText?: string;
	tripId?: number;
	privacy?: PostPrivacy;
	removeImage?: boolean;
}

export interface CreateCommentRequest {
	content: string;
}

export interface UpdateCommentRequest {
	content: string;
}

export interface PostFeedParams {
	page?: number;
	pageSize?: number;
}
