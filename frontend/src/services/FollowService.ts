import axios from "axios";
import type { User } from "@/models/user";

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

export const followUser = async (userId: number): Promise<void> => {
	await axios.post(
		`${API_BASE_URL}/api/users/${userId}/follow`,
		{},
		getAuthHeaders(),
	);
};

export const unfollowUser = async (userId: number): Promise<void> => {
	await axios.post(
		`${API_BASE_URL}/api/users/${userId}/unfollow`,
		{},
		getAuthHeaders(),
	);
};

export const getFollowers = async (userId: number): Promise<User[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/users/${userId}/followers`,
		getAuthHeaders(),
	);
	return response.data;
};

export const getFollowing = async (userId: number): Promise<User[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/users/${userId}/following`,
		getAuthHeaders(),
	);
	return response.data;
};

export const isFollowing = async (
	followerId: number,
	followingId: number,
): Promise<boolean> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/users/${followerId}/following/${followingId}`,
		getAuthHeaders(),
	);
	return response.data as boolean;
};
