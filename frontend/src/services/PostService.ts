import axios from "axios";
import type {
	CreateCommentRequest,
	CreatePostRequest,
	Post,
	PostComment,
	PostFeedParams,
	UpdateCommentRequest,
	UpdatePostRequest,
} from "@/models/post";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5042";

const getAuthHeaders = () => {
	const token = localStorage.getItem("token");
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

const getMultipartHeaders = () => {
	const token = localStorage.getItem("token");
	return {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	};
};

// Post CRUD operations
export const getPublicPosts = async (
	params?: PostFeedParams,
): Promise<Post[]> => {
	const queryParams = new URLSearchParams();
	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.pageSize)
		queryParams.append("pageSize", params.pageSize.toString());

	const response = await axios.get(
		`${API_BASE_URL}/api/posts?${queryParams.toString()}`,
	);
	return response.data;
};

export const getFeedPosts = async (
	params?: PostFeedParams,
): Promise<Post[]> => {
	const queryParams = new URLSearchParams();
	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.pageSize)
		queryParams.append("pageSize", params.pageSize.toString());

	const response = await axios.get(
		`${API_BASE_URL}/api/posts/feed?${queryParams.toString()}`,
		getAuthHeaders(),
	);
	return response.data;
};

export const getUserPosts = async (userId: number): Promise<Post[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/posts/user/${userId}`,
		getAuthHeaders(),
	);
	return response.data;
};

export const getTripPosts = async (tripId: number): Promise<Post[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/posts/trip/${tripId}`,
		getAuthHeaders(),
	);
	return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/posts/${id}`,
		getAuthHeaders(),
	);
	return response.data;
};

export const createPost = async (
	postData: CreatePostRequest,
): Promise<Post> => {
	const formData = new FormData();
	formData.append("content", postData.content);

	if (postData.image) {
		formData.append("image", postData.image);
	}

	if (postData.imageAltText) {
		formData.append("imageAltText", postData.imageAltText);
	}

	if (postData.tripId) {
		formData.append("tripId", postData.tripId.toString());
	}

	if (postData.privacy !== undefined) {
		formData.append("privacy", postData.privacy.toString());
	}

	const response = await axios.post(
		`${API_BASE_URL}/api/posts`,
		formData,
		getMultipartHeaders(),
	);
	return response.data;
};

export const updatePost = async (
	id: number,
	postData: UpdatePostRequest,
): Promise<void> => {
	const formData = new FormData();

	if (postData.content) {
		formData.append("content", postData.content);
	}

	if (postData.image) {
		formData.append("image", postData.image);
	}

	if (postData.imageAltText) {
		formData.append("imageAltText", postData.imageAltText);
	}

	if (postData.tripId) {
		formData.append("tripId", postData.tripId.toString());
	}

	if (postData.privacy !== undefined) {
		formData.append("privacy", postData.privacy.toString());
	}

	if (postData.removeImage) {
		formData.append("removeImage", "true");
	}

	await axios.put(
		`${API_BASE_URL}/api/posts/${id}`,
		formData,
		getMultipartHeaders(),
	);
};

export const deletePost = async (id: number): Promise<void> => {
	await axios.delete(`${API_BASE_URL}/api/posts/${id}`, getAuthHeaders());
};

// Like operations
export const likePost = async (id: number): Promise<void> => {
	await axios.post(
		`${API_BASE_URL}/api/posts/${id}/like`,
		{},
		getAuthHeaders(),
	);
};

export const unlikePost = async (id: number): Promise<void> => {
	await axios.delete(`${API_BASE_URL}/api/posts/${id}/like`, getAuthHeaders());
};

// Comment operations
export const getComments = async (postId: number): Promise<PostComment[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/posts/${postId}/comments`,
		getAuthHeaders(),
	);
	return response.data;
};

export const createComment = async (
	postId: number,
	commentData: CreateCommentRequest,
): Promise<PostComment> => {
	const response = await axios.post(
		`${API_BASE_URL}/api/posts/${postId}/comments`,
		commentData,
		getAuthHeaders(),
	);
	return response.data;
};

export const updateComment = async (
	commentId: number,
	commentData: UpdateCommentRequest,
): Promise<void> => {
	await axios.put(
		`${API_BASE_URL}/api/posts/comments/${commentId}`,
		commentData,
		getAuthHeaders(),
	);
};

export const deleteComment = async (commentId: number): Promise<void> => {
	await axios.delete(
		`${API_BASE_URL}/api/posts/comments/${commentId}`,
		getAuthHeaders(),
	);
};
