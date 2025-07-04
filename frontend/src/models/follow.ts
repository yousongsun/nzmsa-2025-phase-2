import type { User } from "./user";

export interface Follow {
	followId: number;
	followerId: number;
	followingId: number;
	follower: User;
	following: User;
}
