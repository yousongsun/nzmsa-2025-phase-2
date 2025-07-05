export interface Trip {
	tripId: number;
	name: string;
	destination: string;
	startDate: string;
	endDate: string;
	userId: number;
	// Location coordinates for map integration
	latitude?: number;
	longitude?: number;
}
