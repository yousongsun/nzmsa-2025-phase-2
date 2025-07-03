import axios from "axios";
import type { Trip } from "@/models/trip";

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

export const getTrips = async (): Promise<Trip[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/trips`,
		getAuthHeaders(),
	);
	return response.data;
};

export const getTripById = async (id: number): Promise<Trip> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/trips/${id}`,
		getAuthHeaders(),
	);
	return response.data;
};

export const createTrip = async (
	trip: Omit<Trip, "tripId" | "userId">,
): Promise<Trip> => {
	const response = await axios.post(
		`${API_BASE_URL}/api/trips`,
		trip,
		getAuthHeaders(),
	);
	return response.data;
};

export const updateTrip = async (trip: Trip): Promise<void> => {
	await axios.put(
		`${API_BASE_URL}/api/trips/${trip.tripId}`,
		trip,
		getAuthHeaders(),
	);
};

export const deleteTrip = async (id: number): Promise<void> => {
	await axios.delete(`${API_BASE_URL}/api/trips/${id}`, getAuthHeaders());
};
