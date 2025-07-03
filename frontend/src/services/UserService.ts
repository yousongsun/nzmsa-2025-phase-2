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

export const getUserByEmail = async (email: string): Promise<User> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/users/by-email?email=${email}`,
		getAuthHeaders(),
	);
	return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/users/${id}`,
		getAuthHeaders(),
	);
	return response.data;
};
