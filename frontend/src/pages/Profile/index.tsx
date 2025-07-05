import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/auth";
import type { User } from "@/models/user";
import {
	followUser,
	getFollowers,
	getFollowing,
	isFollowing,
	unfollowUser,
} from "@/services/FollowService";
import { getUserById } from "@/services/UserService";

const Profile = () => {
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<User | null>(null);
	const [followers, setFollowers] = useState<User[]>([]);
	const [following, setFollowing] = useState<User[]>([]);
	const [isFollowingUser, setIsFollowingUser] = useState(false);
	const currentUserId = getCurrentUserId();

	useEffect(() => {
		const fetchProfile = async () => {
			if (id) {
				const userId = parseInt(id, 10);
				const fetchedUser = await getUserById(userId);
				const fetchedFollowers = await getFollowers(userId);
				const fetchedFollowing = await getFollowing(userId);
				const followingStatus = currentUserId
					? await isFollowing(currentUserId, userId)
					: false;
				setUser(fetchedUser);
				setFollowers(fetchedFollowers);
				setFollowing(fetchedFollowing);
				setIsFollowingUser(followingStatus);
			}
		};

		fetchProfile();
	}, [id, currentUserId]);

	const handleFollow = async () => {
		if (id) {
			const userId = parseInt(id, 10);
			await followUser(userId);
			setIsFollowingUser(true);
		}
	};

	const handleUnfollow = async () => {
		if (id) {
			const userId = parseInt(id, 10);
			await unfollowUser(userId);
			setIsFollowingUser(false);
		}
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex items-center">
				<h1 className="text-2xl font-bold">
					{user.firstName} {user.lastName}
				</h1>
				{currentUserId !== null && currentUserId !== user.userId && (
					<Button
						onClick={isFollowingUser ? handleUnfollow : handleFollow}
						className="ml-4"
					>
						{isFollowingUser ? "Unfollow" : "Follow"}
					</Button>
				)}
			</div>
			<p className="text-gray-500">{user.email}</p>
			<p className="mt-4">{user.description}</p>

			<div className="mt-4">
				<h2 className="text-xl font-bold">Followers ({followers.length})</h2>
				<ul>
					{followers.map((follower) => (
						<li key={follower.userId} className="p-4 border-b">
							{follower.firstName} {follower.lastName}
						</li>
					))}
				</ul>
			</div>

			<div className="mt-4">
				<h2 className="text-xl font-bold">Following ({following.length})</h2>
				<ul>
					{following.map((followedUser) => (
						<li key={followedUser.userId} className="p-4 border-b">
							{followedUser.firstName} {followedUser.lastName}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Profile;
