import type { PermissionLevel } from "./shared-trip";

export interface TripInvite {
	tripInviteId: number;
	tripId: number;
	email: string;
	permissionLevel: PermissionLevel;
}
