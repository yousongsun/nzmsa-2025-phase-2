import axios from "axios";
import type { ItineraryItem } from "@/models/itinerary-item";

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

export const getItineraryItems = async (
	tripId: number,
): Promise<ItineraryItem[]> => {
	const response = await axios.get(
		`${API_BASE_URL}/api/trips/${tripId}/itinerary-items`,
		getAuthHeaders(),
	);
	return response.data;
};

export const createItineraryItem = async (
	tripId: number,
	itineraryItem: Omit<ItineraryItem, "itineraryItemId" | "tripId">,
): Promise<ItineraryItem> => {
	const response = await axios.post(
		`${API_BASE_URL}/api/trips/${tripId}/itinerary-items`,
		itineraryItem,
		getAuthHeaders(),
	);
	return response.data;
};

export const updateItineraryItem = async (
	tripId: number,
	itineraryItem: ItineraryItem,
): Promise<void> => {
	await axios.put(
		`${API_BASE_URL}/api/trips/${tripId}/itinerary-items/${itineraryItem.itineraryItemId}`,
		itineraryItem,
		getAuthHeaders(),
	);
};

export const deleteItineraryItem = async (
	tripId: number,
	id: number,
): Promise<void> => {
	await axios.delete(
		`${API_BASE_URL}/api/trips/${tripId}/itinerary-items/${id}`,
		getAuthHeaders(),
	);
};
