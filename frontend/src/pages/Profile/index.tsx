import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUserId } from "@/lib/auth";
import type { User } from "@/models/user";
import {
	followUser,
	getFollowers,
	getFollowing,
	isFollowing,
	unfollowUser,
} from "@/services/FollowService";
import { getUserById, updateUser } from "@/services/UserService";

const Profile = () => {
	const { id } = useParams<{ id: string }>();
	const [user, setUser] = useState<User | null>(null);
	const [followers, setFollowers] = useState<User[]>([]);
	const [following, setFollowing] = useState<User[]>([]);
	const [isFollowingUser, setIsFollowingUser] = useState(false);
	const [loading, setLoading] = useState(true);
	const [followLoading, setFollowLoading] = useState(false);
	const [showFollowersDialog, setShowFollowersDialog] = useState(false);
	const [showFollowingDialog, setShowFollowingDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [editForm, setEditForm] = useState({
		firstName: "",
		lastName: "",
		description: "",
	});
	const currentUserId = getCurrentUserId();
	const isOwnProfile =
		currentUserId !== null && currentUserId === parseInt(id || "0", 10);

	useEffect(() => {
		const fetchProfile = async () => {
			if (id) {
				try {
					setLoading(true);
					const userId = parseInt(id, 10);
					const [fetchedUser, fetchedFollowers, fetchedFollowing] =
						await Promise.all([
							getUserById(userId),
							getFollowers(userId),
							getFollowing(userId),
						]);

					const followingStatus = currentUserId
						? await isFollowing(currentUserId, userId)
						: false;

					setUser(fetchedUser);
					setFollowers(fetchedFollowers);
					setFollowing(fetchedFollowing);
					setIsFollowingUser(followingStatus);
					setEditForm({
						firstName: fetchedUser.firstName,
						lastName: fetchedUser.lastName,
						description: fetchedUser.description || "",
					});
				} catch (error) {
					console.error("Failed to fetch profile:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchProfile();
	}, [id, currentUserId]);

	const handleFollow = async () => {
		if (id && currentUserId) {
			try {
				setFollowLoading(true);
				const userId = parseInt(id, 10);
				await followUser(userId);
				setIsFollowingUser(true);
				setFollowers((prev) => [
					...prev,
					{
						userId: currentUserId,
						firstName: "You",
						lastName: "",
						email: "",
						description: "",
					},
				]);
			} catch (error) {
				console.error("Failed to follow user:", error);
			} finally {
				setFollowLoading(false);
			}
		}
	};

	const handleUnfollow = async () => {
		if (id && currentUserId) {
			try {
				setFollowLoading(true);
				const userId = parseInt(id, 10);
				await unfollowUser(userId);
				setIsFollowingUser(false);
				setFollowers((prev) => prev.filter((f) => f.userId !== currentUserId));
			} catch (error) {
				console.error("Failed to unfollow user:", error);
			} finally {
				setFollowLoading(false);
			}
		}
	};

	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		try {
			await updateUser({
				...user,
				firstName: editForm.firstName,
				lastName: editForm.lastName,
				description: editForm.description,
			});

			setUser({
				...user,
				firstName: editForm.firstName,
				lastName: editForm.lastName,
				description: editForm.description,
			});
		} catch (error) {
			console.error("Failed to update user:", error);
		} finally {
			setShowEditDialog(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto p-4">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-lg">Loading profile...</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="container mx-auto p-4">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-lg text-gray-500">User not found</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 max-w-4xl">
			{/* Profile Header */}
			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
								{user.firstName.charAt(0)}
								{user.lastName.charAt(0)}
							</div>
							<div>
								<CardTitle className="text-2xl">
									{user.firstName} {user.lastName}
								</CardTitle>
								<p className="text-gray-500">{user.email}</p>
							</div>
						</div>
						<div className="flex space-x-2">
							{isOwnProfile ? (
								<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
									<DialogTrigger asChild>
										<Button variant="outline">Edit Profile</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Edit Profile</DialogTitle>
											<DialogDescription>
												Make changes to your profile information.
											</DialogDescription>
										</DialogHeader>
										<form onSubmit={handleEditSubmit}>
											<div className="space-y-4">
												<div className="grid grid-cols-2 gap-4">
													<div>
														<Label htmlFor="firstName">First Name</Label>
														<Input
															id="firstName"
															value={editForm.firstName}
															onChange={(e) =>
																setEditForm((prev) => ({
																	...prev,
																	firstName: e.target.value,
																}))
															}
														/>
													</div>
													<div>
														<Label htmlFor="lastName">Last Name</Label>
														<Input
															id="lastName"
															value={editForm.lastName}
															onChange={(e) =>
																setEditForm((prev) => ({
																	...prev,
																	lastName: e.target.value,
																}))
															}
														/>
													</div>
												</div>
												<div>
													<Label htmlFor="description">Description</Label>
													<Input
														id="description"
														value={editForm.description}
														onChange={(e) =>
															setEditForm((prev) => ({
																...prev,
																description: e.target.value,
															}))
														}
														placeholder="Tell us about yourself..."
													/>
												</div>
											</div>
											<DialogFooter className="mt-6">
												<Button
													type="button"
													variant="outline"
													onClick={() => setShowEditDialog(false)}
												>
													Cancel
												</Button>
												<Button type="submit">Save Changes</Button>
											</DialogFooter>
										</form>
									</DialogContent>
								</Dialog>
							) : (
								<Button
									onClick={isFollowingUser ? handleUnfollow : handleFollow}
									disabled={followLoading}
									variant={isFollowingUser ? "outline" : "default"}
								>
									{followLoading
										? "..."
										: isFollowingUser
											? "Unfollow"
											: "Follow"}
								</Button>
							)}
						</div>
					</div>
				</CardHeader>
				{user.description && (
					<CardContent>
						<p className="text-gray-700">{user.description}</p>
					</CardContent>
				)}
			</Card>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<Card
					className="cursor-pointer hover:shadow-md transition-shadow"
					onClick={() => setShowFollowersDialog(true)}
				>
					<CardContent className="p-6 text-center">
						<div className="text-3xl font-bold text-blue-600">
							{followers.length}
						</div>
						<div className="text-gray-500">Followers</div>
					</CardContent>
				</Card>
				<Card
					className="cursor-pointer hover:shadow-md transition-shadow"
					onClick={() => setShowFollowingDialog(true)}
				>
					<CardContent className="p-6 text-center">
						<div className="text-3xl font-bold text-green-600">
							{following.length}
						</div>
						<div className="text-gray-500">Following</div>
					</CardContent>
				</Card>
			</div>

			{/* Followers Dialog */}
			<Dialog open={showFollowersDialog} onOpenChange={setShowFollowersDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Followers ({followers.length})</DialogTitle>
					</DialogHeader>
					<div className="max-h-80 overflow-y-auto">
						{followers.length === 0 ? (
							<p className="text-center text-gray-500 py-8">No followers yet</p>
						) : (
							<div className="space-y-2">
								{followers.map((follower) => (
									<div
										key={follower.userId}
										className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
									>
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
											{follower.firstName.charAt(0)}
											{follower.lastName.charAt(0)}
										</div>
										<div className="flex-1">
											<div className="font-medium">
												{follower.firstName} {follower.lastName}
											</div>
											<div className="text-sm text-gray-500">
												{follower.email}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Following Dialog */}
			<Dialog open={showFollowingDialog} onOpenChange={setShowFollowingDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Following ({following.length})</DialogTitle>
					</DialogHeader>
					<div className="max-h-80 overflow-y-auto">
						{following.length === 0 ? (
							<p className="text-center text-gray-500 py-8">
								Not following anyone yet
							</p>
						) : (
							<div className="space-y-2">
								{following.map((followedUser) => (
									<div
										key={followedUser.userId}
										className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
									>
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
											{followedUser.firstName.charAt(0)}
											{followedUser.lastName.charAt(0)}
										</div>
										<div className="flex-1">
											<div className="font-medium">
												{followedUser.firstName} {followedUser.lastName}
											</div>
											<div className="text-sm text-gray-500">
												{followedUser.email}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Profile;
