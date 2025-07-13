import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUserId } from "@/lib/auth";
import type { User } from "@/models/user";
import { getFollowing, unfollowUser } from "@/services/FollowService";

const Following = () => {
	const [following, setFollowing] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const currentUserId = getCurrentUserId();

	useEffect(() => {
		const fetchFollowing = async () => {
			if (!currentUserId) {
				setLoading(false);
				return;
			}
			try {
				const users = await getFollowing(currentUserId);
				setFollowing(users);
			} catch (err) {
				console.error("Failed to fetch following:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchFollowing();
	}, [currentUserId]);

	const handleUnfollow = async (userId: number) => {
		if (!currentUserId) return;
		try {
			await unfollowUser(userId);
			setFollowing((prev) => prev.filter((u) => u.userId !== userId));
		} catch (err) {
			console.error("Failed to unfollow user:", err);
		}
	};

	if (loading) {
		return <div className="p-4">Loading following...</div>;
	}

	if (!currentUserId) {
		return <div className="p-4">You must be logged in to view this page.</div>;
	}

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			{following.length === 0 ? (
				<p>You are not following anyone.</p>
			) : (
				following.map((user) => (
					<Card
						key={user.userId}
						className="p-4 flex items-center justify-between"
					>
						<Link to={`/profile/${user.userId}`} className="font-medium">
							{user.firstName} {user.lastName}
						</Link>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleUnfollow(user.userId)}
						>
							Unfollow
						</Button>
					</Card>
				))
			)}
		</div>
	);
};

export default Following;
