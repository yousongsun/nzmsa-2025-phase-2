import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
	isFollowing,
	unfollowUser,
} from "@/services/FollowService";
import { getUserByEmail, searchUsers } from "@/services/UserService";

interface UserSearchDialogProps {
	trigger?: React.ReactNode;
}

export function UserSearchDialog({ trigger }: UserSearchDialogProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [followingStatus, setFollowingStatus] = useState<
		Record<number, boolean>
	>({});
	const [followLoading, setFollowLoading] = useState<Record<number, boolean>>(
		{},
	);
	const currentUserId = getCurrentUserId();

	const handleSearch = async (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		setLoading(true);
		setError("");

		try {
			let users: User[] = [];

			// If query looks like an email, search by email
			if (query.includes("@")) {
				try {
					const user = await getUserByEmail(query.trim());
					users = [user];
				} catch {
					// If email search fails, fall back to general search
					users = await searchUsers(query.trim());
				}
			} else {
				// Search by name
				users = await searchUsers(query.trim());
			}

			// Filter out current user
			const filteredUsers = users.filter(
				(user) => user.userId !== currentUserId,
			);
			setSearchResults(filteredUsers);

			// Check following status for each user
			if (currentUserId && filteredUsers.length > 0) {
				const statusPromises = filteredUsers.map(async (user) => {
					try {
						const status = await isFollowing(currentUserId, user.userId);
						return { userId: user.userId, isFollowing: status };
					} catch {
						return { userId: user.userId, isFollowing: false };
					}
				});

				const statuses = await Promise.all(statusPromises);
				const statusMap = statuses.reduce(
					(acc, { userId, isFollowing }) => {
						acc[userId] = isFollowing;
						return acc;
					},
					{} as Record<number, boolean>,
				);

				setFollowingStatus(statusMap);
			}
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"An error occurred while searching for users.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleFollow = async (userId: number) => {
		if (!currentUserId) return;

		setFollowLoading((prev) => ({ ...prev, [userId]: true }));

		try {
			await followUser(userId);
			setFollowingStatus((prev) => ({ ...prev, [userId]: true }));
		} catch (error) {
			console.error("Failed to follow user:", error);
		} finally {
			setFollowLoading((prev) => ({ ...prev, [userId]: false }));
		}
	};

	const handleUnfollow = async (userId: number) => {
		if (!currentUserId) return;

		setFollowLoading((prev) => ({ ...prev, [userId]: true }));

		try {
			await unfollowUser(userId);
			setFollowingStatus((prev) => ({ ...prev, [userId]: false }));
		} catch (error) {
			console.error("Failed to unfollow user:", error);
		} finally {
			setFollowLoading((prev) => ({ ...prev, [userId]: false }));
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			// Reset state when dialog closes
			setSearchQuery("");
			setSearchResults([]);
			setError("");
			setFollowingStatus({});
			setFollowLoading({});
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline">
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Find Users Icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						Find Users
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Find Users</DialogTitle>
					<DialogDescription>
						Search for users by name or email address to follow them.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="search-query">Search</Label>
						<Input
							id="search-query"
							type="text"
							placeholder="Enter name or email..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								handleSearch(e.target.value);
							}}
							className={error ? "border-red-500" : ""}
						/>
					</div>

					{error && (
						<div className="p-3 rounded-md bg-red-50 border border-red-200">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<div className="max-h-80 overflow-y-auto">
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
								<span className="ml-2 text-sm text-gray-600">Searching...</span>
							</div>
						) : searchResults.length === 0 ? (
							searchQuery.trim() ? (
								<p className="text-center text-gray-500 py-8">
									No users found matching "{searchQuery}"
								</p>
							) : (
								<p className="text-center text-gray-500 py-8">
									Start typing to search for users
								</p>
							)
						) : (
							<div className="space-y-2">
								{searchResults.map((user) => (
									<div
										key={user.userId}
										className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted"
									>
										<Link
											to={`/profile/${user.userId}`}
											className="flex items-center space-x-3 flex-1 hover:text-blue-600"
											onClick={() => setOpen(false)}
										>
											<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
												{user.firstName.charAt(0)}
												{user.lastName.charAt(0)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="font-medium truncate">
													{user.firstName} {user.lastName}
												</div>
												<div className="text-sm text-gray-500 truncate">
													{user.email}
												</div>
												{user.description && (
													<div className="text-xs text-gray-400 truncate mt-1">
														{user.description}
													</div>
												)}
											</div>
										</Link>

										{currentUserId && (
											<Button
												size="sm"
												variant={
													followingStatus[user.userId] ? "outline" : "default"
												}
												onClick={() =>
													followingStatus[user.userId]
														? handleUnfollow(user.userId)
														: handleFollow(user.userId)
												}
												disabled={followLoading[user.userId]}
											>
												{followLoading[user.userId] ? (
													<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
												) : followingStatus[user.userId] ? (
													"Unfollow"
												) : (
													"Follow"
												)}
											</Button>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
