export const PermissionLevel = {
	View: "View",
	Edit: "Edit",
} as const;

export type PermissionLevel =
	(typeof PermissionLevel)[keyof typeof PermissionLevel];

export interface SharedTrip {
	sharedTripId: number;
	tripId: number;
	userId: number;
	permissionLevel: PermissionLevel;
}
