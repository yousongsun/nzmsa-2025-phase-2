import axios from "axios";
import type { User } from "@/models/user";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5042";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	userId: number;
	email: string;
	token: string;
}

export interface RegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	description?: string;
}

export const login = async (
	credentials: LoginRequest,
): Promise<LoginResponse> => {
	const response = await axios.post(
		`${API_BASE_URL}/api/users/login`,
		credentials,
		{ withCredentials: true },
	);
	return response.data;
};

export const register = async (userData: RegisterRequest): Promise<User> => {
	const response = await axios.post(`${API_BASE_URL}/api/users`, userData);
	return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
	const token = getToken();
	if (!token) {
		throw new Error("No authentication token found");
	}

	const response = await axios.get(`${API_BASE_URL}/api/users/current`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const logout = () => {
	localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
	const token = localStorage.getItem("token");
	return token !== null;
};

export const getToken = (): string | null => {
	return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
	localStorage.setItem("token", token);
};
