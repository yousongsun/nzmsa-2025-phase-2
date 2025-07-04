import axios from "axios";
import type { SharedTrip } from "@/models/shared-trip";

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

export const getSharedTrips = async (tripId: number): Promise<SharedTrip[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/trips/${tripId}/shared-trips`,
		getAuthHeaders(),
	);
	return response.data;
};

export const createSharedTrip = async (
	tripId: number,
	sharedTrip: Omit<SharedTrip, "sharedTripId" | "tripId">,
): Promise<SharedTrip> => {
	const response = await axios.post(
		`${API_BASE_URL}/api/trips/${tripId}/shared-trips`,
		sharedTrip,
		getAuthHeaders(),
	);
	return response.data;
};

export const updateSharedTrip = async (
	tripId: number,
	sharedTrip: SharedTrip,
): Promise<void> => {
	await axios.put(
		`${API_BASE_URL}/api/trips/${tripId}/shared-trips/${sharedTrip.sharedTripId}`,
		sharedTrip,
		getAuthHeaders(),
	);
};

export const deleteSharedTrip = async (
	tripId: number,
	id: number,
): Promise<void> => {
	await axios.delete(
		`${API_BASE_URL}/api/trips/${tripId}/shared-trips/${id}`,
		getAuthHeaders(),
	);
};
